export default {
  /**
   * @param {Request} request
   * @param {{ RESULTS_KV: KVNamespace; ALLOWED_ORIGINS?: string }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/api/results" && request.method === "POST") {
      if (!cors.get("Access-Control-Allow-Origin")) {
        return json({ ok: false, error: "origin_not_allowed" }, 403, cors);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid_json" }, 400, cors);
      }

      const parsed = parseResult(body);
      if (!parsed.ok) {
        return json({ ok: false, error: "invalid_payload", details: parsed.details }, 400, cors);
      }

      const id = `sub_${parsed.value.submissionId}`;
      const record = {
        ...parsed.value,
        storedAt: new Date().toISOString(),
      };

      await env.RESULTS_KV.put(id, JSON.stringify(record), {
        expirationTtl: 60 * 60 * 24 * 90, // 90 days
      });

      return json({ ok: true, id }, 201, cors);
    }

    if (url.pathname === "/health") {
      return json({ ok: true }, 200, cors);
    }

    return json({ ok: false, error: "not_found" }, 404, cors);
  },
};

/**
 * @param {string} origin
 * @param {string | undefined} allowedOriginsCsv
 */
function corsHeaders(origin, allowedOriginsCsv) {
  const headers = new Headers();
  const allowed = new Set(
    (allowedOriginsCsv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

  // Local dev convenience. Keep this small; production should use ALLOWED_ORIGINS.
  if (!allowed.size) {
    allowed.add("http://localhost:3000");
    allowed.add("http://localhost:5173");
    allowed.add("http://127.0.0.1:5500");
  }

  if (origin && allowed.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "content-type");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return headers;
}

/**
 * @param {any} obj
 */
function parseResult(obj) {
  const details = {};

  const submissionId = typeof obj?.submissionId === "string" ? obj.submissionId.trim() : "";
  if (!submissionId || submissionId.length > 80) details.submissionId = "required_string_max_80";

  const version = typeof obj?.version === "string" ? obj.version.trim() : "";
  if (!version || version.length > 20) details.version = "required_string_max_20";

  const language = typeof obj?.language === "string" ? obj.language.trim() : "";
  if (!["mg", "fr", "en"].includes(language)) details.language = "must_be_mg_fr_en";

  const score = Number(obj?.score);
  const totalQuestions = Number(obj?.totalQuestions);
  if (!Number.isInteger(score) || score < 0) details.score = "must_be_integer_gte_0";
  if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) details.totalQuestions = "must_be_integer_gt_0";
  if (Number.isInteger(score) && Number.isInteger(totalQuestions) && score > totalQuestions) {
    details.score = "must_be_lte_totalQuestions";
  }

  const durationMs = Number(obj?.durationMs);
  if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 1000 * 60 * 60) {
    details.durationMs = "must_be_number_0_to_3600000";
  }

  const clientTs = typeof obj?.clientTs === "string" ? obj.clientTs.trim() : "";
  if (clientTs && clientTs.length > 40) details.clientTs = "max_40";

  const hasErrors = Object.keys(details).length > 0;
  if (hasErrors) return { ok: false, details };

  return {
    ok: true,
    value: {
      submissionId,
      version,
      language,
      score,
      totalQuestions,
      durationMs,
      clientTs: clientTs || null,
    },
  };
}

/**
 * @param {any} data
 * @param {number} status
 * @param {Headers} headers
 */
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}

