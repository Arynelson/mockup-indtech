# Ummix Ads — Mockup independente de indústria

Mockup demonstrativo interativo para apresentação do painel de audiência aplicado à indústria.

## Rodar localmente

```bash
npm install
npm run dev
```

O Vite abre o preview em `http://localhost:3004/`.

## Escopo

- Os dados são mockados e ficam no componente da tela.
- Não há login, autenticação, API, backend ou importação de componentes do `web/`.
- A linguagem visual foi alinhada por inspeção ao `web/` atual: sidebar escura, canvas neutro, cards brancos, tipografia Arial e stepper de quatro etapas.
- O bloco `Perfil & Hábitos` simula pessoas com deficiência, Jovem Aprendiz e Faixa Etária.
- O contexto de veiculação mantém praça, acessibilidade, momento profissional, turno e tipo de mídia.
- O fluxo demonstrativo não inclui Objetivo da Campanha, Reconhecimento da Marca, Formato ou Duração do Spot.
- O resumo executivo compara TV, rádio e mix recomendado para apoiar a apresentação.

## Validação

```bash
npm run build
```

O detalhamento da inspeção visual e responsiva está em [`design-qa.md`](./design-qa.md).
