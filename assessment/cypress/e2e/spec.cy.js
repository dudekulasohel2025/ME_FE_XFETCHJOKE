describe("Fetch Joke App", () => {
  const url = "http://localhost:5173";

  beforeEach(() => {
    cy.visit(url);
  });

  it("loads the page and shows heading & button", () => {
    cy.contains("h1", "Random Joke").should("be.visible");
    cy.contains("button", "Fetch joke").should("be.visible").and("not.be.disabled");
    cy.contains("Click the button to fetch a fresh one.").should("be.visible");
  });

  it("fetches and displays a joke (stubbed API)", () => {
    cy.intercept(
      "GET",
      "https://official-joke-api.appspot.com/random_joke",
      {
        statusCode: 200,
        body: {
          id: 123,
          type: "general",
          setup: "Why do programmers prefer dark mode?",
          punchline: "Because light attracts bugs!",
        },
      }
    ).as("getJoke");

    cy.contains("button", "Fetch joke").click();
    cy.wait("@getJoke");

    cy.contains("Why do programmers prefer dark mode?").should("be.visible");
    cy.contains("Because light attracts bugs!").should("be.visible");
  });

  it("disables button during loading and re-enables after", () => {
    // Delay response to observe loading state
    cy.intercept(
      "GET",
      "https://official-joke-api.appspot.com/random_joke",
      (req) => {
        req.reply((res) => {
          res.delay = 800; // ms
          res.send({
            id: 7,
            type: "general",
            setup: "Mock setup",
            punchline: "Mock punchline",
          });
        });
      }
    ).as("getJokeSlow");

    cy.contains("button", "Fetch joke").click().should("be.disabled");
    cy.contains("button", "Fetching...").should("exist");
    cy.wait("@getJokeSlow");
    cy.contains("button", "Fetch joke").should("not.be.disabled");
  });

  it("shows error and allows retry", () => {
    cy.intercept(
      "GET",
      "https://official-joke-api.appspot.com/random_joke",
      { statusCode: 500, body: {} }
    ).as("getJokeFail");

    cy.contains("button", "Fetch joke").click();
    cy.wait("@getJokeFail");
    cy.contains("Could not fetch a joke. Try again.").should("be.visible");
    cy.contains("button", "Try again").should("be.visible");
  });
});

