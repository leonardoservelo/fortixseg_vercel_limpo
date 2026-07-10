export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido. Use POST para criar uma preferência de checkout."
    });
  }

  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const useSandbox = process.env.MERCADO_PAGO_USE_SANDBOX === "true";

    if (!accessToken) {
      return res.status(500).json({
        error: "MERCADO_PAGO_ACCESS_TOKEN não configurado na Vercel."
      });
    }

    const body = req.body || {};
    const cartItems = Array.isArray(body.items) ? body.items : [];

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: "Carrinho vazio."
      });
    }

    const items = cartItems
      .map((item) => ({
        title: String(item.title || item.name || "Treinamento FortixSeg"),
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.price || item.unit_price || 0),
        currency_id: "BRL"
      }))
      .filter((item) => item.unit_price > 0);

    if (items.length === 0) {
      return res.status(400).json({
        error: "Itens inválidos no carrinho."
      });
    }

    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      `https://${req.headers.host}`;

    const preference = {
      items,
      back_urls: {
        success: `${baseUrl}/?payment=success`,
        failure: `${baseUrl}/?payment=failure`,
        pending: `${baseUrl}/?payment=pending`
      },
      auto_return: "approved",
      statement_descriptor: "FORTIXSEG"
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro ao criar preferência no Mercado Pago.",
        details: data
      });
    }

    return res.status(200).json({
      id: data.id,
      init_point: useSandbox ? data.sandbox_init_point : data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      production_init_point: data.init_point
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno ao criar checkout.",
      details: error.message
    });
  }
}
