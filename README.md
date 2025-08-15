# 🎉 Feriados Brasileiros - História e Curiosidades

Uma aplicação completa para explorar os feriados nacionais brasileiros com inteligência artificial. Descubra a história, contexto histórico e curiosidades interessantes sobre cada feriado através de uma interface moderna e interativa.

## ✨ Sobre a Aplicação

Esta aplicação combina a [Brasil API](https://brasilapi.com.br/docs#tag/Feriados-Nacionais) para buscar feriados nacionais com IA para gerar resumos detalhados e curiosidades sobre cada feriado. Os usuários podem:

- **📅 Visualizar feriados** de qualquer ano com imagens temáticas
- **🤖 Gerar curiosidades** usando IA sobre qualquer feriado
- **📚 Aprender história** com contexto histórico detalhado
- **🎨 Interface moderna** com design responsivo e animações

## 🚀 Funcionalidades

- **🗓️ Lista de Feriados**: Busca automática de feriados nacionais brasileiros
- **🖼️ Imagens Temáticas**: Cada feriado tem uma imagem correspondente
- **🧠 IA Integrada**: Geração de resumos e curiosidades com OpenAI
- **📱 Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **⚡ Performance**: Carregamento rápido e experiência fluida
- **🎯 SEO Otimizado**: Metadados completos para melhor indexação

## 🛠️ Tecnologias Utilizadas

- **Backend**: Cloudflare Workers + Deco Runtime
- **Frontend**: React + Vite + TanStack Router
- **Estilização**: Tailwind CSS + shadcn/ui
- **IA**: OpenAI GPT-4 para geração de conteúdo
- **API**: Brasil API para dados de feriados
- **Deploy**: Deco Platform + Cloudflare Workers

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js ≥22.0.0
- [Deco CLI](https://deco.chat): `npm i -g deco-cli`
- Conta no [Deco Platform](https://deco.chat)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd feriados-curiosidades
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a aplicação**
```bash
npm run configure
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8787`

## 🚀 Deploy

Para fazer o deploy da aplicação:

```bash
npm run deploy
```

### Links de Produção

- **Aplicação Principal**: https://feriados-curiosidades.deco.page
- **Backup**: https://feriados-curiosidades--1j4wzn9b9z.deco.page

## 🤖 Agente MCP

Esta aplicação também funciona como um servidor MCP (Model Context Protocol) que pode ser usado por agentes de IA:

- **Agente no Deco**: [Acessar Agente](https://deco.chat/chats?agentId=ed59d228-82a8-49c4-9eae-a87f75469bcc&workspace=shared%2Fconverte)

## 📁 Estrutura do Projeto

```
feriados-curiosidades/
├── server/                    # Servidor MCP (Cloudflare Workers)
│   ├── main.ts               # Ponto de entrada do servidor
│   ├── tools.ts              # Tools para feriados e IA
│   ├── workflows.ts          # Workflows organizados
│   ├── schema.ts             # Schema do banco de dados
│   └── deco.gen.ts           # Tipos gerados automaticamente
├── view/                     # Frontend React
│   ├── src/
│   │   ├── routes/home.tsx   # Página principal
│   │   ├── lib/hooks.ts      # Hooks personalizados
│   │   ├── lib/utils.ts      # Utilitários e mapeamento de imagens
│   │   └── components/       # Componentes UI
│   └── public/feriados/      # Imagens dos feriados
└── package.json              # Dependências e scripts
```

## 🔧 Scripts Disponíveis

- **`npm run dev`** - Inicia desenvolvimento com hot reload
- **`npm run gen`** - Gera tipos para integrações externas
- **`npm run gen:self`** - Gera tipos para suas próprias tools/workflows
- **`npm run deploy`** - Deploy para produção
- **`npm run db:generate`** - Gera migrações do banco de dados

## 🎯 Como Usar

1. **Acesse a aplicação** no navegador
2. **Selecione o ano** desejado no cabeçalho
3. **Visualize os feriados** em cards com imagens
4. **Clique em qualquer feriado** para gerar curiosidades
5. **Leia o resumo** com contexto histórico e curiosidades

## 🔗 APIs e Integrações

- **Brasil API**: Busca de feriados nacionais
- **OpenAI**: Geração de resumos e curiosidades
- **Deco Platform**: Deploy e infraestrutura

## 📚 Documentação

- [Deco Platform](https://deco.chat/about)
- [Brasil API](https://brasilapi.com.br/docs)
- [Deco Documentation](https://docs.deco.page)

## 👨‍💻 Desenvolvedor

**Rogério Orioli**

- **GitHub**: [@rogeriorioli](https://github.com/rogeriorioli)
- **LinkedIn**: [rogeriorioli](https://linkedin.com/in/rogeriorioli)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**🎉 Explore os feriados brasileiros de uma forma nova e interativa!**
