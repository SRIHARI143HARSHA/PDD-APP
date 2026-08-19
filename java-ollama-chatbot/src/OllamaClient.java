import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * OllamaClient connects the Java Desktop app to the local Ollama LLM backend API.
 * Default Endpoint: http://localhost:11434/api/generate
 * Default Model: llama3.2
 */
public class OllamaClient {
    private static final String DEFAULT_OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String DEFAULT_MODEL = "llama3.2";

    private final String ollamaUrl;
    private final String modelName;
    private final HttpClient httpClient;

    public OllamaClient() {
        this(DEFAULT_OLLAMA_URL, DEFAULT_MODEL);
    }

    public OllamaClient(String ollamaUrl, String modelName) {
        this.ollamaUrl = (ollamaUrl != null && !ollamaUrl.isEmpty()) ? ollamaUrl : DEFAULT_OLLAMA_URL;
        this.modelName = (modelName != null && !modelName.isEmpty()) ? modelName : DEFAULT_MODEL;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(8))
                .build();
    }

    /**
     * Checks if local Ollama server is reachable on port 11434.
     */
    public boolean isOllamaAvailable() {
        try {
            URI tagsUri = URI.create("http://localhost:11434/api/tags");
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(tagsUri)
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Sends prompt to Ollama /api/generate endpoint and returns text response.
     */
    public String generateResponse(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "Prompt cannot be empty.";
        }

        try {
            String jsonPayload = String.format(
                "{\"model\": \"%s\", \"prompt\": \"%s\", \"stream\": false}",
                escapeJson(modelName),
                escapeJson(prompt)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ollamaUrl))
                    .timeout(Duration.ofSeconds(45))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseJsonResponse(response.body());
            } else if (response.statusCode() == 404) {
                return "⚠️ Ollama Error: Model '" + modelName + "' was not found.\n" +
                       "Please run 'ollama pull " + modelName + "' in your terminal to download the model.";
            } else {
                return "⚠️ Ollama API Error (HTTP " + response.statusCode() + "): " + response.body();
            }
        } catch (java.net.ConnectException e) {
            return "⚠️ Connection Error: Unable to reach Ollama at " + ollamaUrl + "\n\n" +
                   "Please verify that Ollama is running locally:\n" +
                   "1. Open terminal & run 'ollama serve'\n" +
                   "2. Ensure model 'llama3.2' is downloaded ('ollama pull llama3.2')";
        } catch (java.net.http.HttpTimeoutException e) {
            return "⚠️ Timeout Error: Ollama generation timed out after 45 seconds. Try asking a shorter question.";
        } catch (Exception e) {
            return "⚠️ Unexpected Error: " + e.getMessage();
        }
    }

    /**
     * Escapes raw text for JSON string compatibility.
     */
    private String escapeJson(String text) {
        if (text == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            switch (ch) {
                case '"':  sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (ch < ' ') {
                        sb.append(String.format("\\u%04x", (int) ch));
                    } else {
                        sb.append(ch);
                    }
                    break;
            }
        }
        return sb.toString();
    }

    /**
     * Robust parser for Ollama JSON response payload without third-party dependencies.
     */
    private String parseJsonResponse(String jsonResponseBody) {
        if (jsonResponseBody == null || jsonResponseBody.isEmpty()) {
            return "Received empty payload from Ollama.";
        }

        int responseKeyIndex = jsonResponseBody.indexOf("\"response\":");
        if (responseKeyIndex != -1) {
            int startQuote = jsonResponseBody.indexOf("\"", responseKeyIndex + 11);
            if (startQuote != -1) {
                StringBuilder sb = new StringBuilder();
                boolean isEscaped = false;
                for (int i = startQuote + 1; i < jsonResponseBody.length(); i++) {
                    char c = jsonResponseBody.charAt(i);
                    if (isEscaped) {
                        switch (c) {
                            case '"':  sb.append('"'); break;
                            case '\\': sb.append('\\'); break;
                            case 'n':  sb.append('\n'); break;
                            case 'r':  sb.append('\r'); break;
                            case 't':  sb.append('\t'); break;
                            default:   sb.append(c); break;
                        }
                        isEscaped = false;
                    } else if (c == '\\') {
                        isEscaped = true;
                    } else if (c == '"') {
                        break;
                    } else {
                        sb.append(c);
                    }
                }
                return sb.toString();
            }
        }
        return jsonResponseBody;
    }
}
