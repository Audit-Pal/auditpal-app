# AuditPal SolBench

AuditPal is a specialized platform for auditing and benchmarking Solidity smart contracts. It provides advanced analytics, optimization challenges, and prompt comparisons to help developers write more efficient and secure code.

## Features

- **Detailed Analytics**: Deep dive into contract performance and vulnerabilities.
- **Optimization Challenges**: Test your skills in reducing gas costs and improving security.
- **Prompt Comparison**: Compare results from different auditing models and approaches.
- **Solana Benchmarking**: Integrated tools for cross-chain analysis focusing on Solana and EVM.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

Copy `.env.example` to `.env.local` and provide your API keys:
- `TAOSTATS_API_KEY`: Required for backend analytics.
- `NETUID`: Network UID for benchmarking.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). See `vercel_deployment.md` in the brain artifacts directory for detailed steps.
