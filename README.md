<a href="https://github.com/IsaacAlves7/backend-for-frontend"><img src="https://github.com/user-attachments/assets/8a18a714-6ca8-4fa9-9257-cecb1f050c68"></a>

> Versículo chave: "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos." - Provérbios 16:3

# 📦📱🎨 BFF - Backend for Frontend
<img height="77" align="right" src="https://github.com/user-attachments/assets/3b04d45c-8e80-4421-8a86-2b1cf6b03a86" />

Conforme aumenta a complexidade dos produtos que desenvolvemos, mais provável é que aumente também a quantidade de “caras” que ele vai ter. Hoje é muito comum, por exemplo, um mesmo produto ter uma interface web, outra móvel e outra responsiva. Neste contexto, entendo que seja bastante tentador projetar uma única API de back-end para todas as interfaces, que seja reutilizável.

Entretanto, é claro que, como sempre, em um produto complexo uma solução simples não cai bem. As necessidades e restrições são bastante variáveis, e às vezes é necessária uma personalização. Para resolver este problema, é que entra em cena o _BFF_, que até pode ser considerado um _best friends forever_, mas significa na verdade _Back-end for Front-end_.

A Arquitetura **BFF - Backend for Frontend** é um padrão onde você cria um back-end específico para cada tipo de front-end (como web, mobile ou desktop). Em vez de ter um único back-end genérico que serve para todos, cada front-end tem seu próprio "mini-backend" adaptado às suas necessidades, reduzindo a complexidade no cliente e otimizando a performance.

Por exemplo, uma API BFF para um app mobile pode retornar dados já filtrados e otimizados para economia de banda, enquanto o BFF da versão web pode fornecer dados mais completos. Essa abordagem melhora a experiência do usuário, facilita manutenção e testes, e evita lógica excessiva no front-end.

<table>
  <tr>
    <td><a href="https://blog.bitsrc.io/bff-pattern-backend-for-frontend-an-introduction-e4fa965128bf?source=post_page---author_recirc--df10edf0e8d0----1---------------------1744195f_55d3_428f_b6fa_370d3ddc78c4--------------"><img src="https://github.com/user-attachments/assets/8afda213-16a2-41b6-8379-8ddead4ac676" height="677"></a>
</td>
    <td><img src="https://github.com/user-attachments/assets/348dad2b-072f-4207-ac8e-0f823d637261" height="677"></td>
  </tr>
</table>

A arquitetura BFF se encaixa muito bem com microserviços. Na verdade, ela é frequentemente usada em conjunto com microserviços para resolver um problema comum: a complexidade de consumir diretamente múltiplos serviços no front-end.

> [!Warning]
> Aviso: Os detalhes deste post foram extraídos do Blog de Engenharia do SoundCloud. Todo o crédito pelos detalhes técnicos pertence à equipe de engenharia do SoundCloud. Os links para os artigos originais estão presentes na seção de referências no final do post. Tentamos analisar os detalhes e fornecer nossa opinião sobre eles. Se você encontrar alguma imprecisão ou omissão, deixe um comentário e faremos o possível para corrigi-las.

Assim como na vida real, os melhores amigos também podem ser salvadores quando se trata de projetos de software.

O SoundCloud descobriu isso quando quis evoluir sua arquitetura de serviço para lidar com milhões de solicitações por hora.

Caso você não saiba, o SoundCloud é um site online para ouvir música gratuitamente. Eles têm mais de 320 milhões de faixas musicais e a maior comunidade online do mundo de artistas, bandas, DJs e criadores de áudio.

Inicialmente, o aplicativo web do SoundCloud seguia o que eles chamavam de abordagem "comer a própria ração". Uma única API monolítica atendia aos requisitos de aplicativos oficiais e integrações de terceiros.

Naturalmente, com o crescimento do SoundCloud, essa abordagem tornou-se insuficiente para suas necessidades de escalabilidade operacional e organizacional, resultando em uma migração da arquitetura monolítica para microsserviços.

No entanto, isso se mostrou mais fácil na teoria do que na prática. Com a criação de novos microsserviços, os clientes que dependiam do monolito passaram a ter que acessar múltiplos serviços para obter os dados necessários. Isso dificultou o desenvolvimento para os clientes, incluindo aplicativos de terceiros que utilizavam o SoundCloud.

Como essa situação era insustentável, o SoundCloud precisou criar uma maneira de facilitar o desenvolvimento para os aplicativos clientes, mantendo a arquitetura de microsserviços subjacente. Neste artigo, veremos como eles alcançaram esses objetivos com BFFs (Browser Forwarders), Serviços de Valor Agregado e Gateways de Domínio.

**BFFs no SoundCloud**: O termo BFF significa Backends-for-Frontends (Backends para Frontends). Em termos mais simples, pense em um BFF como um gateway de API dedicado para cada dispositivo ou tipo de interface que interage com seu aplicativo.

O diagrama abaixo mostra uma visão geral do BFF:

<img width="1600" height="971" alt="image" src="https://github.com/user-attachments/assets/96f99b89-ca2b-497d-9237-8086ba4ae353" />

Em um sistema de microserviços, cada serviço é especializado em uma funcionalidade (como autenticação, pagamentos, produtos etc.), mas o front-end precisaria orquestrar várias chamadas, lidar com autenticação, formatação, e mais. O BFF entra nesse ponto como uma camada de orquestração entre os microserviços e o front-end.

Ele agrega, adapta e transforma os dados de vários serviços para entregar ao front-end exatamente o que ele precisa, sem que o front precise entender toda a estrutura dos serviços internos. Isso melhora a performance, simplifica o front-end e ajuda a manter separação de responsabilidades.

Discutimos o API Gateway. Essa abordagem é boa se tivermos um único cliente na web ou no celular. Se nosso aplicativo for usado por vários clientes, como web, dispositivos móveis, IoT, etc., não é uma boa ideia usar um único API Gateway para todos os tipos de clientes. O processo ficará complicado rapidamente e poderá inchar o serviço API Gateway, tornando-o um único serviço Monolith.

<img src="https://github.com/user-attachments/assets/dea5743c-855c-43e0-9fb9-210fa03addd1" height="377">

<img width="794" height="629" alt="1_6a-UA3VgHJ1IO8aiuu2SLw" src="https://github.com/user-attachments/assets/df9b8c41-9616-475f-a03f-0623ff781b51" />

<table>
  <tr>
    <td><img width="1200" height="674" alt="1_O7orUX6FefecZSG0c8pmeA" src="https://github.com/user-attachments/assets/6b81511d-a1aa-4e3d-82de-7fb9c6c49ed6" /></td>
    <td><img width="1369" height="626" alt="1_JCqUL2QL1DQYTOW2BzbUFQ" src="https://github.com/user-attachments/assets/61e7a802-81b1-4852-aa75-adb174c699d0" /></td>
  </tr>
</table>

A melhor abordagem para esse tipo de cenário é usar um API Gateway separado para cada tipo de cliente, esse padrão de arquitetura é chamado de padrão Backend for FrontEnd (BFF) e se tornou uma palavra da moda.

<img width="709" height="439" alt="26a5b9c9-e1e1-4dfb-b60b-9f7e66372386_709x439" src="https://github.com/user-attachments/assets/d263dc43-b06d-428a-9a2f-bc50bc989676" />

A equipe de engenharia do SoundCloud opera dezenas de BFFs (Broadcast Frameworks), cada um atendendo a um tipo específico de cliente. Por exemplo, um BFF chamado API Móvel atende clientes Android e iOS. Há também um BFF de API Web que lida com a interface web e os widgets. Além disso, existem BFFs dedicados para APIs públicas e de parceiros.

Todo o tráfego externo que chega ao SoundCloud passa por um dos BFFs. Esses BFFs também lidam com diversas funcionalidades, como:

- Limitação de taxa
- Autenticação
- Sanitização de cabeçalho
- Controle de cache

O padrão BFF é um paradigma arquitetônico, uma variante do padrão de API Gateway e compreende vários back-ends projetados para atender às demandas de aplicativos front-end específicos, como desktop, navegador e aplicativos móveis nativos, dispositivos IoT etc.

<img width="1600" height="1025" alt="image" src="https://github.com/user-attachments/assets/d8c4bbe6-81bf-4b02-bea0-3eb2ba6fb35a" />

Para facilitar o compartilhamento de lógica comum entre todos os BFFs (Broadcast Frameworks for Frontiers), todos eles utilizam uma biblioteca interna que fornece recursos avançados. Quaisquer alterações nessa biblioteca são implementadas automaticamente em questão de horas.

O SoundCloud segue a filosofia de desenvolvimento de código-fonte interno para esses BFFs.

De acordo com essa filosofia, equipes individuais podem contribuir para a base de código do BFF, e uma equipe central revisa cada alteração com base nos princípios discutidos no Coletivo. Esse Coletivo, organizado por um Líder de Plataforma, se reúne regularmente para discutir problemas e compartilhar conhecimento.

**Vantagens do BFF**: Os BFFs oferecem diversas vantagens. Vejamos algumas das principais.

1 - Autonomia: A autonomia é talvez o maior valor agregado ao usar um BFF.

APIs separadas por tipo de cliente significam que podemos otimizar a API para o que for mais conveniente para um determinado tipo de cliente.

Por exemplo, no caso do SoundCloud, os clientes móveis preferiam respostas maiores com um número maior de entidades incorporadas como forma de minimizar o número de solicitações. Em contraste, o front-end web prefere respostas mais granulares.

Os BFFs atendem a essas demandas variáveis ​​para cada tipo de cliente.

2 - Resiliência e Menor Risco: Os BFFs também reduzem o risco geral de indisponibilidade do aplicativo.

Embora uma implantação malsucedida possa derrubar um BFF inteiro em uma zona de disponibilidade, isso não derruba toda a plataforma, o que era uma possibilidade com a abordagem de API monolítica.

Veja o diagrama abaixo que representa um cenário em que a indisponibilidade do BFF móvel não significa que o BFF web também ficará indisponível.

<img width="1600" height="971" alt="image" src="https://github.com/user-attachments/assets/3c221b20-bb25-432f-a908-4282744dfa00" />

## [BFF] Microservices
Sistema completo de gerenciamento de tarefas com arquitetura de microsserviços e padrão **Backend For Frontend (BFF)**, construído com TypeScript/Node.js, Prisma, React.js e React Native.

📐 Arquitetura

```
┌──────────────┐      ┌──────────────┐
│   Web App    │      │  Mobile App  │
│  React.js    │      │ React Native │
│  + Redux     │      │  + Redux     │
└──────┬───────┘      └──────┬───────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   BFF Web    │      │  BFF Mobile  │
│  Node :3001  │      │  Node :3002  │
└──────┬───────┘      └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  │ (fan-out paralelo)
    ┌─────────────┼─────────────────┐
    ▼             ▼                 ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│  Auth  │  │  User    │  │    Task      │  │ Notification │
│ :4001  │  │ :4002    │  │   :4003      │  │   :4004      │
└───┬────┘  └────┬─────┘  └──────┬───────┘  └──────┬───────┘
    │             │               │                  │
    ▼             ▼               ▼                  ▼
 auth_db       user_db         task_db          notif_db
(PostgreSQL) (PostgreSQL)   (PostgreSQL)      (PostgreSQL)
```

Por que BFF?

O padrão BFF cria um backend dedicado para cada tipo de cliente:

- **BFF Web** — agrega dados de múltiplos serviços em uma única chamada (ex: `/dashboard` retorna usuário + stats + tarefas + notificações em paralelo)
- **BFF Mobile** — retorna payloads menores otimizados para bandwidth limitado (sem campos desnecessários)

🗂️ Estrutura do Projeto

```
bff-app/
├── docker-compose.yml
├── package.json                    # Workspace raiz (npm workspaces)
├── shared/
│   └── types.ts                    # Tipos TypeScript compartilhados
│
├── services/
│   ├── auth-service/               # JWT + refresh token rotativo
│   ├── user-service/               # Perfil de usuário
│   ├── task-service/               # CRUD tarefas + comentários
│   ├── notification-service/       # Notificações push
│   ├── bff-web/                    # BFF para React.js
│   └── bff-mobile/                 # BFF para React Native
│
├── web/                            # React.js + Redux + Tailwind
└── mobile/                         # React Native (Expo) + Redux
```

---

🛠️ Stack Tecnológica

| Camada           | Tecnologia                                     |
|------------------|------------------------------------------------|
| Microsserviços   | Node.js + Express + TypeScript                 |
| ORM              | Prisma 5 + PostgreSQL                          |
| Autenticação     | JWT (access 15min) + Refresh Token rotativo    |
| Cache/Session    | Redis                                          |
| Web App          | React 18 + Redux Toolkit + React Query + Vite  |
| Estilização Web  | Tailwind CSS + React Hook Form + Zod           |
| Mobile App       | React Native (Expo) + Redux Toolkit            |
| Containerização  | Docker + Docker Compose                        |

⚡ Início Rápido

Pré-requisitos
- Docker & Docker Compose
- Node.js 20+

1. Subir com Docker (recomendado)

```bash
git clone <repo>
cd bff-app

# Subir todos os serviços (BD, Redis, microsserviços)
docker-compose up -d

# Ver logs
docker-compose logs -f bff-web bff-mobile
```

2. Desenvolvimento Local

```bash
# Instalar dependências de todos os workspaces
npm install

# Subir apenas os bancos de dados e Redis
docker-compose up -d postgres-auth postgres-user postgres-task postgres-notification redis

# Rodar migrações em todos os serviços
npm run db:migrate

# Subir todos os serviços em modo dev
npm run dev
```

3. App Web

```bash
cd web
npm run dev
# Acesse: http://localhost:3000
```

4. App Mobile

```bash
cd mobile
npx expo start
# Escaneie o QR code com o app Expo Go
```

🌐 Portas dos Serviços

| Serviço              | Porta |
|----------------------|-------|
| BFF Web              | 3001  |
| BFF Mobile           | 3002  |
| Auth Service         | 4001  |
| User Service         | 4002  |
| Task Service         | 4003  |
| Notification Service | 4004  |
| Web App (Vite)       | 3000  |
| PostgreSQL Auth      | 5432  |
| PostgreSQL User      | 5433  |
| PostgreSQL Task      | 5434  |
| PostgreSQL Notif.    | 5435  |
| Redis                | 6379  |

📡 Endpoints BFF Web

Autenticação (público)
| Método | Rota                  | Descrição              |
|--------|-----------------------|------------------------|
| POST   | `/api/auth/register`  | Criar conta            |
| POST   | `/api/auth/login`     | Login                  |
| POST   | `/api/auth/refresh`   | Renovar access token   |
| POST   | `/api/auth/logout`    | Logout                 |

Autenticado (Bearer token)
| Método | Rota                         | Descrição                                  |
|--------|------------------------------|--------------------------------------------|
| GET    | `/api/dashboard`             | 🔥 Agregado: user + stats + tarefas + notif |
| GET    | `/api/tasks`                 | Listar tarefas (filtros + paginação)       |
| POST   | `/api/tasks`                 | Criar tarefa                               |
| PATCH  | `/api/tasks/:id`             | Atualizar tarefa                           |
| DELETE | `/api/tasks/:id`             | Excluir tarefa                             |
| GET    | `/api/tasks/:id/detail`      | Tarefa + perfil do assignee               |
| GET    | `/api/notifications`         | Listar notificações                        |
| PATCH  | `/api/notifications/:id/read`| Marcar como lida                           |
| PATCH  | `/api/notifications/read-all`| Marcar todas como lidas                    |
| GET    | `/api/profile`               | Ver perfil                                 |
| PATCH  | `/api/profile`               | Atualizar perfil                           |


🔑 Variáveis de Ambiente

Crie um arquivo `.env` em cada serviço (já configurado no docker-compose):

```env
# auth-service
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
JWT_SECRET=mude-em-producao
JWT_REFRESH_SECRET=mude-em-producao
PORT=4001

# bff-web
AUTH_SERVICE_URL=http://localhost:4001
USER_SERVICE_URL=http://localhost:4002
TASK_SERVICE_URL=http://localhost:4003
NOTIFICATION_SERVICE_URL=http://localhost:4004
ALLOWED_ORIGINS=http://localhost:3000
PORT=3001

# mobile (Expo)
EXPO_PUBLIC_API_URL=http://localhost:3002/api
```

🗄️ Modelos de Dados

Auth Service
- `User` — credenciais (email + hash da senha)
- `RefreshToken` — tokens rotativos com expiração

User Service
- `User` — perfil (nome, avatar, bio)

Task Service
- `Task` — título, descrição, status, prioridade, assignee, tags, prazo
- `Comment` — comentários por tarefa

Notification Service
- `Notification` — tipo, título, mensagem, lida/não-lida, metadata


🧪 Testando a API

```bash
# Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"senha123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'

# Dashboard (substitua TOKEN)
curl http://localhost:3001/api/dashboard \
  -H "Authorization: Bearer TOKEN"

# Criar tarefa
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Implementar feature X","priority":"HIGH","status":"TODO"}'
```

📱 Features da Aplicação

<img width="2400" height="952" alt="3-bff" src="https://github.com/user-attachments/assets/1e1c4c76-daf2-4da9-8935-68c107b6e1d1" />

- ✅ Autenticação completa (registro, login, logout, refresh token automático)
- ✅ Dashboard agregado com stats em tempo real
- ✅ CRUD completo de tarefas com filtros e paginação
- ✅ Sistema de notificações em tempo real
- ✅ Perfil do usuário editável
- ✅ BFF Web otimizado para React.js
- ✅ BFF Mobile com payloads enxutos para React Native
- ✅ Redux Toolkit com thunks para gerenciamento de estado
- ✅ Interceptor de token refresh automático (sem logout ao expirar)
- ✅ Rate limiting por IP
- ✅ Validação de dados com Zod em todos os serviços
- ✅ Health checks em todos os serviços

## [BFF] Microfrontends
