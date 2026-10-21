# Aqui Você Pode Falar — projeto e implementação

Especificação: pedido integral fornecido pelo usuário em 20/10/2026 e imagem de referência. Entrega local em Next.js, TypeScript, Tailwind e Lucide, sem backend.

Visual: branco e bege #f8f8f5, azul #225c89, verde #36735b, âmbar #a6722c e texto #14283e. Fonte Arial arredondada pelo espaçamento, títulos de peso 700. Cartões claros, navegação lateral na equipe e barra inferior no celular. As cinco expressões são o elemento característico da experiência do aluno.

1. Criar estrutura e testes de integração para envio, acompanhamento, urgência, saída discreta e fechamento com justificativa.
2. Modelo tipado em lib/model.ts, repositório local em lib/store.tsx. Pedidos, mensagens, providências e eventos compartilham identificador; PIN e dados fictícios ficam apenas no navegador. Rascunhos preservados em sessionStorage; nunca colocados na URL.
3. Shell e páginas escolares: /aluno, /atividades, /conteudos, /acompanhar e /equipe. Saída imediata com replace; Escape duplo. Três toques na estrela retornam.
4. Fluxo guiado com uma pergunta por etapa, adulto, privacidade, urgência e confirmação; chat integrado ao painel.
5. Painel com filtros, agenda, indicadores agregados, edição de caso e checklist de encerramento.
6. Instalar dependências, executar lint, TypeScript e build. Testar no navegador em desktop e celular, recarregar dados e registrar resultados no README.

Persistência é demonstrativa, sem autenticação ou criptografia. Não usar dados reais. Atendimento urgente nunca promete disponibilidade imediata. Publicação não faz parte desta entrega local.
