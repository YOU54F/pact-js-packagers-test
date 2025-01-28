const axios = require("axios");
const defaultBaseUrl = "http://your-api.example.com";
const api = (baseUrl = defaultBaseUrl) => ({
  getHealth: () =>
    axios.get(baseUrl + "/health").then((response) => response.data.status),
  /* other endpoints here */
});

const { PactV3, MatchersV3 } = require("@you54f/pact");

const provider = new PactV3({
  consumer: "consumer-js-v3",
  provider: "provider-js-v3",
  logLevel: "info",
  logFile: "./foo.txt",
});

const {
  like,
} = MatchersV3;

describe("test with pact", () => {
  it("should setup a test with pact", () => {
    provider
      .given("Server is healthy")
      .uponReceiving("A request for API health")
      .withRequest({
        method: "GET",
        path: "/health",
      })
      .willRespondWith({
        status: 200,
        body: { status: like("up") },
      });
    return provider.executeTest((mockserver) => {
      const client = api(mockserver.url);
      return client.getHealth().then((health) => {
        expect(health).toEqual("up");
      });
    });
  });
});