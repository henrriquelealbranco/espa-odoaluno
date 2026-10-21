# Espaço do Aluno

Protótipo funcional de **Aqui Você Pode Falar**, um piloto escolar sem fins lucrativos. A experiência pública do estudante usa somente o nome **Espaço do Aluno**. Interface inspirada na imagem fornecida, com áreas de estudante e equipe conectadas pelos dados do navegador.

## Executar no Windows

Requisito: Node.js 20.9 ou superior com npm. As dependências já foram instaladas nesta entrega.

Abra `iniciar.cmd` ou execute no PowerShell:

```powershell
cd "C:\Users\Lenovo\Desktop\Backup_Google_Drive\espaco-do-aluno"
npm.cmd install
npm.cmd run dev
```

Acesse **http://localhost:3000/aluno**. O painel fica em **http://localhost:3000/equipe**; clique em **Entrar na demonstração**. Não há senha nem autenticação real da equipe.

Para executar a versão otimizada, pare o servidor de desenvolvimento com Ctrl+C:

```powershell
npm.cmd run build
npm.cmd start
```

Na mesma rede, o servidor aceita acesso pelo IP do computador na porta 3000, sujeito ao firewall local. A simulação de celular foi verificada no navegador em 390 × 844; computador, em 1440 × 1000. Cada navegador/dispositivo possui seus próprios dados locais; o protótipo não sincroniza dados pela rede.

## Roteiro sugerido para a gravação

1. Abra `/aluno`, escolha um sentimento e visite as atividades escolares.
2. Volte ao início e clique em **Conversar com alguém**. Selecione uma modalidade e uma pessoa da equipe. As disponibilidades são fictícias.
3. Responda às perguntas ou pule as opcionais; use somente informações fictícias. É possível voltar sem perder respostas. Anexos guardam apenas o nome do arquivo.
4. Escolha anonimato, nome fictício ou apelido. Crie um PIN de quatro números e envie. Guarde o código gerado e seu PIN.
5. Clique em **Acompanhar depois** e entre com esse código/PIN. Mensagens enviadas ficam salvas.
6. Abra `/equipe` **no mesmo navegador e endereço**. Localize o pedido, assuma o atendimento, responda, marque uma conversa e registre uma providência. Volte ao acompanhamento para ver a resposta.
7. Selecione **Ainda não** no acompanhamento. O pedido volta para acompanhamento com prioridade Alta, preservando Urgente quando já estava nesse nível.
8. No painel, revise as quatro verificações de encerramento e registre uma justificativa obrigatória. As respostas do checklist também são guardadas.
9. Use os filtros, a agenda e os indicadores agregados. **Reiniciar demonstração** restaura os oito pedidos fictícios, as mensagens, as tarefas e o sentimento escolhido.

### Acompanhamento fictício pronto

- Código: **AZUL-4827**
- PIN: **1234**

Esse pedido possui a conversa de exemplo solicitada. Pedidos recém-enviados começam sem mensagens da equipe: a confirmação não simula uma resposta humana que ainda não ocorreu.

### Saída discreta

O botão **Trocar de tela** está no cabeçalho de todas as telas do estudante, inclusive formulário, urgência, confirmação e acompanhamento. Abre `/atividades` com substituição da entrada atual do histórico e título **Minhas Atividades**. Pressionar **Escape duas vezes em até 650 ms** faz o mesmo. Não há confirmação nem animação de saída. Três toques na estrela do rodapé de atividades em até 1,2 segundo retornam ao início; a interface não anuncia esse atalho.

O rascunho permanece na sessão. Ao retornar ao início, clique em **Conversar com alguém** para retomá-lo. O recurso troca a tela atual; não apaga histórico anterior do navegador, dados locais, capturas do sistema nem garante ocultação em menus do sistema operacional.

## Rotas

| Rota          | Conteúdo                                                                    |
| ------------- | --------------------------------------------------------------------------- |
| `/`           | Redireciona para `/aluno`                                                   |
| `/aluno`      | Sentimentos, semana, cartões e fluxo guiado                                 |
| `/atividades` | Tarefas persistentes, matérias, calendário e avisos                         |
| `/conteudos`  | Materiais escolares com leitura funcional                                   |
| `/acompanhar` | Acesso por código/PIN, conversa e retorno de segurança                      |
| `/equipe`     | Acesso demo, pedidos, filtros, detalhe, agenda, indicadores e configurações |

## Arquivos criados e arquitetura

```text
src/
  app/
    layout.tsx                 Metadados neutros e provedor local
    page.tsx                   Entrada principal
    globals.css                Tailwind, tokens, estilos e responsividade
    icon.svg                   Favicon neutro de caderno
    aluno/page.tsx             Entrada da experiência do estudante
    atividades/page.tsx        Página neutra e título próprio
    conteudos/page.tsx         Conteúdos e leitura
    acompanhar/page.tsx        Código, PIN, chat e retorno
    equipe/page.tsx            Entrada do painel
  components/
    shell.tsx                  Cabeçalhos, navegação, atalhos e barra demo
    student-home.tsx           Sentimentos e início
    support-flow.tsx           Perguntas, urgência, identidade e confirmação
    activities.tsx             Tarefas e calendário
    chat.tsx                   Conversa compartilhada pelas duas áreas
    team-dashboard.tsx         Navegação, filtros, tabela, agenda e configurações
    team-detail.tsx            Atendimento, providências e encerramento
    team-indicators.tsx        Indicadores agregados
  lib/
    model.ts                   Tipos, dados fictícios e criação de pedidos
    store.tsx                  Persistência local e operações de leitura/escrita
tests/flows.spec.ts             Testes de integração com navegador real
playwright.config.ts           Configuração dos testes
scripts/inspect.mjs            Diagnóstico de largura no celular
next.config.ts                 Configuração do Next.js
postcss.config.mjs             Tailwind/PostCSS
eslint.config.mjs              Lint de Next.js e TypeScript
tsconfig.json                  TypeScript estrito
package.json / package-lock.json Dependências e comandos
.gitignore                     Artefatos gerados ignorados
iniciar.cmd                    Inicialização local no Windows
docs/plano.md                  Planejamento da implementação
docs/*.png                     Capturas de computador e celular
README.md                      Este guia
```

`model.ts` mantém o contrato dos dados separado do armazenamento. Para migrar para Supabase ou outro serviço, substitua a implementação de `store.tsx` por um repositório autenticado, mantendo as operações `add` e `update`. Antes de uso real, a autorização e a separação entre dados públicos, internos e identificadores precisam ser implementadas no servidor.

Pedidos, PINs, mensagens, providências, linha do tempo, prioridades, agenda e encerramento persistem no LocalStorage (`espaco-aluno-demo-v1`). O rascunho e as sessões demonstrativas ficam no SessionStorage. Tarefas, humor e configuração de horário também ficam no navegador. Abas do mesmo endereço recebem atualizações por eventos de armazenamento.

## Verificação

Resultados da entrega em 20/10/2026: instalação concluída, lint sem erros ou avisos, TypeScript e build de produção aprovados. **Cinco testes de integração passaram no Chrome**, com capturas e verificação de ausência de rolagem horizontal da página nas larguras testadas. A validação de celular usa viewport simulada, sem teste em aparelho físico. A rota `/aluno` também retornou HTTP 200 no servidor local.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
```

Os testes usam Google Chrome instalado e iniciam/reutilizam o servidor na porta 3000. Cobrem a troca de tela, Escape duplo, estrela, código/PIN, persistência, conversa entre áreas, reabertura, urgência, preservação do rascunho, agendamento, providências, tarefas, reset e dimensões de tela. Capturas são gravadas em `docs/`.

Auditoria de dependências nesta entrega: `npm audit --omit=dev` não identificou vulnerabilidades. A auditoria completa reportou cinco alertas de severidade alta na cadeia de ferramentas de desenvolvimento (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`). As versões publicadas consultadas de `braces` e `micromatch` ainda eram as versões sinalizadas; não foi aplicado downgrade incompatível do Next.js/ESLint. Reavaliar as correções antes de adotar o projeto em produção.

## Limites

Protótipo exclusivamente demonstrativo. O PIN é uma barreira visual local, armazenada sem criptografia, e não fornece segurança real contra alguém com acesso ao navegador. O painel não possui autenticação real. Nenhum dado é enviado a backend, e imagens não são carregadas para fora do dispositivo. Não use nomes reais, e-mail, telefone, CPF ou informações pessoais.

Uma implementação real exige autenticação segura, criptografia, política de retenção, responsáveis, protocolo de atendimento e avaliação de adequação à LGPD e às normas de proteção de crianças e adolescentes. Os textos de limites também aparecem no painel.

O canal é acompanhado nos horários definidos pela escola. Não há promessa de resposta imediata ou monitoramento contínuo. O protótipo não é serviço de emergência, terapia ou substituto de acompanhamento profissional.
