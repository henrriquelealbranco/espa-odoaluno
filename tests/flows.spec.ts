import { test, expect } from "@playwright/test";

test("saída discreta, teclado e retorno neutro no celular", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/aluno");
  await page.getByRole("button", { name: "Conversar com alguém" }).click();
  await page.getByRole("button", { name: "Trocar de tela" }).click();
  await expect(page).toHaveURL(/atividades/);
  await expect(page).toHaveTitle("Minhas Atividades");
  const star = page.getByRole("button", { name: "Estrela" });
  await star.click({ clickCount: 3 });
  await expect(page).toHaveURL(/aluno/);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/atividades/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("pedido, PIN, persistência, chat e reabertura por insegurança", async ({
  page,
}) => {
  await page.goto("/aluno");
  await page.getByRole("button", { name: "Conversar com alguém" }).click();
  await page
    .getByRole("button", { name: "Quero conversar pessoalmente" })
    .click();
  await page.getByRole("button", { name: /Ana.*Orientadora/ }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("PIN de quatro números").fill("4827");
  await page
    .getByRole("button", { name: "Enviar pedido", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Seu pedido foi recebido." }),
  ).toBeVisible();
  const code = await page.getByTestId("request-code").innerText();
  await page.getByRole("button", { name: "Acompanhar depois" }).click();
  await page.getByLabel("Código do pedido").fill(code);
  await page.getByLabel("PIN de quatro números").fill("0000");
  await page.getByRole("button", { name: "Acessar conversa" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Código ou PIN" }),
  ).toBeVisible();
  await page.getByLabel("PIN de quatro números").fill("4827");
  await page.getByRole("button", { name: "Acessar conversa" }).click();
  await page.getByLabel("Sua mensagem").fill("Prefiro conversar no intervalo.");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await page.reload();
  await expect(page.getByText("Prefiro conversar no intervalo.")).toBeVisible();
  await page.getByRole("button", { name: "Ainda não", exact: true }).click();
  await page.goto("/equipe");
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await page.getByRole("button", { name: new RegExp("^" + code) }).click();
  await expect(page.getByText("Alta", { exact: true }).first()).toBeVisible();
  await page
    .getByRole("button", { name: "Encerrar caso", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Confirmar encerramento" }),
  ).toBeDisabled();
  await page
    .getByLabel("Justificativa do encerramento")
    .fill("Conversa e medidas registradas com revisão pela equipe.");
  await page.getByRole("button", { name: "Confirmar encerramento" }).click();
  await expect(
    page.getByText("Concluído", { exact: true }).first(),
  ).toBeVisible();
});

test("relato guiado preserva respostas e registra urgência no painel", async ({
  page,
}) => {
  await page.goto("/aluno");
  await page.getByRole("button", { name: "Conversar com alguém" }).click();
  await page
    .getByRole("button", { name: "Quero contar o que aconteceu" })
    .click();
  await page.getByRole("button", { name: /Carla.*Psicóloga escolar/ }).click();
  await page.getByRole("button", { name: "Comigo", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByRole("button", { name: "Pátio", exact: true }).click();
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Comigo", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pátio", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Trocar de tela" }).click();
  await expect(page).toHaveURL(/atividades/);
  await page.goto("/aluno");
  await page.getByRole("button", { name: "Conversar com alguém" }).click();
  await expect(
    page.getByRole("button", { name: "Pátio", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Pular esta pergunta" }).click();
  await page
    .getByRole("button", { name: "Sim, estou em perigo agora" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Você fez certo em pedir ajuda." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Trocar de tela" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Enviar pedido urgente" }).click();
  await page.getByLabel("PIN de quatro números").fill("2468");
  await page.getByRole("button", { name: "Enviar pedido urgente" }).click();
  const code = await page.getByTestId("request-code").innerText();
  await page.goto("/equipe");
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await page.getByRole("button", { name: "Urgentes", exact: true }).click();
  await page.getByRole("button", { name: new RegExp("^" + code) }).click();
  await expect(
    page.getByText("Urgente", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Pátio", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Assumir atendimento" }).click();
  await page
    .getByRole("button", { name: "Marcar conversa", exact: true })
    .click();
  await page.getByLabel("Data e hora").fill("2026-10-22T10:30");
  await page.getByRole("button", { name: "Salvar registro" }).click();
  await page
    .getByRole("button", { name: "Registrar providência", exact: true })
    .last()
    .click();
  await page
    .getByLabel("Providência realizada")
    .fill("Conversa reservada com adulto de confiança.");
  await page.getByRole("button", { name: "Salvar registro" }).click();
  await page.reload();
  await page.getByRole("button", { name: new RegExp("^" + code) }).click();
  await expect(
    page.getByText("Conversa reservada com adulto de confiança.", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByLabel("Sua mensagem")
    .fill("Podemos conversar na sala de orientação.");
  await page
    .getByRole("button", { name: "Enviar mensagem", exact: true })
    .first()
    .click();
  await page.goto("/acompanhar");
  await page.getByLabel("Código do pedido").fill(code);
  await page.getByLabel("PIN de quatro números").fill("2468");
  await page.getByRole("button", { name: "Acessar conversa" }).click();
  await expect(
    page.getByText("Podemos conversar na sala de orientação.", { exact: true }),
  ).toBeVisible();
});

test("relato opcional, anexo simulado e apelido sem informações reais", async ({
  page,
}) => {
  await page.goto("/aluno");
  await page.getByRole("button", { name: "Conversar com alguém" }).click();
  await page
    .getByRole("button", { name: "Estou preocupado com outra pessoa" })
    .click();
  await page.getByRole("button", { name: /Não tenho preferência/ }).click();
  for (let i = 0; i < 6; i++) {
    await expect(
      page.getByRole("button", { name: "Trocar de tela" }),
    ).toBeVisible();
    await expect(page).toHaveTitle("Espaço do Aluno");
    await page.getByRole("button", { name: "Pular esta pergunta" }).click();
  }
  await page
    .getByLabel("Seu relato")
    .fill("Gostaria de conversar sobre uma situação na escola.");
  await page.locator("input[type=file]").setInputFiles({
    name: "exemplo.png",
    mimeType: "image/png",
    buffer: Buffer.from("arquivo fictício"),
  });
  await expect(page.getByText("exemplo.png", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page
    .getByRole("button", { name: "Usar um apelido para acompanhar" })
    .click();
  await page.getByLabel("Apelido", { exact: true }).fill("Estrela");
  await page.getByLabel("PIN de quatro números").fill("12");
  await page
    .getByRole("button", { name: "Enviar pedido", exact: true })
    .click();
  await expect(
    page.getByText("Crie um PIN com exatamente quatro números."),
  ).toBeVisible();
  await page.getByLabel("PIN de quatro números").fill("1234");
  await page
    .getByRole("button", { name: "Enviar pedido", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Seu pedido foi recebido." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Trocar de tela" }),
  ).toBeVisible();
});

test("layouts desktop e celular, tarefas e dados fictícios", async ({
  page,
}) => {
  await page.goto("/aluno");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "docs/aluno-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/aluno-celular.png", fullPage: true });
  await page.goto("/atividades");
  await page.getByRole("button", { name: "Concluir Matemática" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Reabrir Matemática" }),
  ).toBeVisible();
  await page.goto("/equipe");
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "docs/equipe-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/equipe-celular.png", fullPage: true });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("button", { name: "Indicadores", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Pedidos por semana" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("button", { name: "Reiniciar demonstração" }).click();
  await page.getByRole("button", { name: "Restaurar dados fictícios" }).click();
  await page.goto("/atividades");
  await expect(
    page.getByRole("button", { name: "Concluir Matemática" }),
  ).toBeVisible();
});
