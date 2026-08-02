module.exports = function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    ok: true,
    service: "brahmand",
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
    modelConfigured: Boolean(process.env.OPENAI_MODEL),
    timestamp: new Date().toISOString()
  });
};
