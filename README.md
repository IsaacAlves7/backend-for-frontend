# BFF - Backend for Frontend
<img height="77" align="right" src="https://github.com/user-attachments/assets/3b04d45c-8e80-4421-8a86-2b1cf6b03a86" />

Não existe uma única Stack de Netflix. A Stack Java da Netflix tem evoluído nos últimos anos, começando desde frameworks internos até microserviços da era Groovy e, mais recentemente, migrando para a GraphQL Federation.

Todas as mudanças foram feitas para resolver problemas da abordagem anterior. Por exemplo, a mudança para o RxJava foi para lidar melhor com os fanouts e a mudança para a Federação GraphQL foi para resolver os problemas de complexidade causados pelo RxJava.

Junto com essas mudanças, houve também uma evolução paralela em termos de versões da linguagem Java do Java 8 para o 17 e agora para o 21+. Muito disso também foi motivado pelo Spring Boot versão 3 finalmente ultrapassando o Java 8 e forçando todo o ecossistema a atualizar.

Essas mudanças permitiram que eles construíssem aplicações mais performantes que podem economizar custos de CPU.

No geral, o tema tem sido a padronização da abordagem na construção de microserviços em toda a organização. No entanto, considerando os desafios constantes enfrentados para operar em sua escala mantendo-se à frente da concorrência, a evolução continuará.

A arquitetura Java da Netflix em 2025 não é um resquício do passado, mas um sistema de engenharia moderno e deliberado. O que torna interessante não é a escolha da linguagem, mas a forma como essa escolha é continuamente reavaliada, otimizada e alinhada com as restrições do mundo real.

O sistema não é estático. A Netflix ultrapassou os limites do Java 8 ao atualizar agressivamente sua pilha, não reescrevendo-a. Abraçou o Spring Boot como base, mas o expandiu para atender às demandas únicas de uma plataforma global de streaming. Adotou o GraphQL para flexibilidade, threads virtuais para concorrência e ZGC para desempenho.

Alguns pontos-chave são os seguintes:

<table>
	<tr>
		<td><img src="https://github.com/user-attachments/assets/45375a09-7c36-487b-8c11-6b9f2c19cc2f" height="777"></td>
		<td><img src="https://github.com/user-attachments/assets/1ed5e463-aa6a-4c46-ae33-c707f67b9241" height="777"></td>
	</tr>
</table>

Aqui estão os detalhes dessas iterações:

API Gateway
A Netflix segue uma arquitetura de microserviços. Cada funcionalidade e cada dado pertence a um microserviço construído usando Java (inicialmente versão 8).

Isso significa que renderizar uma tela (como a Lista de Listas de Filmes ou LOLOMO) envolvia buscar dados de dezenas de microserviços. Mas fazer todas essas ligações do cliente criou um problema de desempenho.

A Netflix inicialmente usou o padrão API Gateway usando Zuul para lidar com a orquestração.

BFFs com Groovy & RxJava
Usar um único gateway para múltiplos clientes era um problema para a Netflix porque cada cliente (como TV, aplicativos móveis ou navegador) tinha diferenças sutis.

Para lidar com isso, a Netflix usou o padrão Backend-for-Frontend (BFF). O Zuul foi movido para o papel de proxy

. Nesse padrão, cada frontend ou interface de usuário recebe seu próprio mini-backend que executa o fanout e orquestração de requisições para múltiplos serviços.

Os BFFs foram construídos usando scripts Groovy e o fato de serviços foi feito usando RxJava para gerenciamento de threads.

Federação
GraphQLA abordagem Groovy e RxJava exigiu mais trabalho dos desenvolvedores de interface na criação dos scripts Groovy. Além disso, programação reativa geralmente é difícil.

Recentemente, a Netflix migrou para a GraphQL Federation. Com o GraphQL, um cliente pode especificar exatamente qual conjunto de campos precisa, resolvendo assim o problema de overfetching e underfetching com APIs REST.

A Federação GraphQL cuida de chamar os microserviços necessários para buscar os dados.

Esses microsserviços são chamados de Domain Graph Service (DGS) e são construídos usando os pacotes Java 17, Spring Boot 3 e Spring Boot Netflix OSS. A transição do Java 8 para o Java 17 resultou em ganhos de 20% no CPU.

Mais recentemente, a Netflix começou a migrar para Java 21 para aproveitar recursos como threads virtuais.

- Java ainda é competitivo quando tratado como um ecossistema. A Netflix extrai ganhos significativos de desempenho dos recursos modernos da JVM. Não se contenta com configurações padrão ou frameworks antigos. A evolução é deliberada.

- Possuir a plataforma possibilita velocidade. Construir ferramentas internas para patches, transformações e implantações transforma as atualizações de risco em rotina. A propriedade da plataforma é uma vantagem para eles.

- Threads virtuais reduzem a complexidade. Eles mantêm um estilo de programação familiar enquanto escalam melhor sob carga. O retorno é um código mais limpo, menos bugs e modelos mentais mais simples.

- A infraestrutura de ajuste, e não apenas o código, melhora a confiabilidade. Atualizar o coletor de lixo e otimizar o comportamento da thread resultou em menos timeouts, taxas de erro menores e um throughput mais consistente em geral.

A Netflix é predominantemente uma loja de Java. Todo aplicativo backend na Netflix é um aplicativo Java. Isso inclui:

- Aplicações internas
- O software que alimenta um dos maiores estúdios de cinema do mundo e é usado para produzir filmes
- O aplicativo de streaming da Netflix

No entanto, isso não significa que a pilha Java da Netflix seja estática. Ao longo dos anos, evoluiu significativamente.

Vamos analisar a evolução do uso do Java na Netflix à luz das mudanças arquitetônicas gerais que ocorreram para apoiar as necessidades em transformação.

A Netflix é predominantemente uma loja de Java.

Todo aplicativo backend (incluindo apps internos, streaming e de produção de filmes) na Netflix é um aplicativo Java.

No entanto, a pilha Java não é estática e passou por várias iterações ao longo dos anos.

Aqui estão os detalhes dessas iterações:

1. API Gateway: A Netflix segue uma arquitetura de microserviços. Cada funcionalidade e cada dado pertence a um microserviço construído usando Java (inicialmente versão 8)

2. BFFs com Groovy & RxJava: Usar um único gateway para múltiplos clientes era um problema para a Netflix porque cada cliente (como TV, aplicativos móveis ou navegador) tinha diferenças sutis. Para lidar com isso, a Netflix usou o padrão Backend-for-Frontend (BFF). Zuul foi transferido para o papel de procurador

2. GraphQL Federation: GraphQLA abordagem Groovy e RxJava exigiu mais trabalho dos desenvolvedores de interface na criação dos scripts Groovy. Além disso, programação reativa geralmente é difícil.

> [!Warning]
> Os detalhes deste post foram derivados dos artigos/vídeos compartilhados online pela equipe de engenharia da Netflix. Todo o crédito pelos detalhes técnicos vai para a equipe de engenharia da Netflix. Os links para os artigos e vídeos originais estão presentes na seção de referências ao final do post. Tentamos analisar os detalhes e dar nossa opinião sobre eles. Se você encontrar alguma imprecisão ou omissão, por favor, deixe um comentário e faremos o possível para corrigi-las.

A Era Groovy com melhores amigos: É de conhecimento geral que a Netflix tem uma arquitetura de microsserviços.

Cada funcionalidade e cada dado pertence a um microserviço e existem milhares de microsserviços. Além disso, múltiplos microserviços se comunicam entre si para realizar algumas das funcionalidades mais complexas.

Por exemplo, quando você abre o aplicativo da Netflix, vê a tela do LOLOMO. Aqui, LOLOMO significa lista de listas de filmes e é essencialmente construído buscando dados de muitos microserviços, tais como:

- Serviço que retorna uma lista dos 10 melhores filmes
- Serviço de arte que fornece imagens personalizadas para cada filme
- Serviço de metadados de filmes que retorna os títulos dos filmes, detalhes dos atores e descrições
- LOLOMO que fornece quais listas realmente renderizar para a página inicial do usuário.

O diagrama abaixo mostra essa situação:

<img width="1600" height="975" alt="unnamed" src="https://github.com/user-attachments/assets/93214bed-8a75-4914-9291-5f10f0a78b1e" />

É bem possível que renderizar apenas uma tela no aplicativo da Netflix envolva ligar para 10 serviços.

No entanto, ligar para tantos serviços pelo seu dispositivo (como a televisão) ou pelo aplicativo móvel geralmente é ineficiente. Fazer 10 chamadas de rede não escala e resulta em uma experiência ruim para o cliente. Muitos aplicativos de streaming sofrem com esses problemas de desempenho.

Para evitar esses problemas, a Netflix usou uma única porta principal para as várias APIs. O dispositivo faz uma ligação para essa porta da frente que realiza o fanout para todos os diferentes microserviços. A porta da frente funciona como um portal e a Netflix usou Zuul para esse fim.

Essa abordagem funciona porque a chamada para múltiplos microserviços ocorre na rede interna, que é muito rápida, eliminando assim as implicações de desempenho.

No entanto, havia outro problema a ser resolvido.

Todos os diferentes dispositivos que os usuários podem usar para acessar a Netflix têm requisitos distintos de maneiras sutis. Embora a Netflix tenha tentado manter uma aparência e sensação consistentes para a interface e seu comportamento em todos os dispositivos, cada dispositivo ainda tem limitações diferentes em termos de memória ou largura de banda de rede e, portanto, carrega os dados de maneiras um pouco diferentes.

É difícil criar uma única API REST que funcione em todos esses dispositivos diferentes. Alguns dos problemas são os seguintes:

APIs REST Ou buscam dados demais ou de muito poucos

Mesmo que criassem uma API REST para cuidar de todas as necessidades de dados, seria uma experiência ruim porque estariam desperdiçando muitos dados

No caso de múltiplas APIs, isso significaria múltiplas chamadas de rede

Para lidar com isso, a Netflix usou o padrão backend para frontend (BFF).

Nesse padrão, cada frontend ou interface de usuário recebe seu próprio mini backend. O mini backend é responsável por realizar o fanout e buscar os dados que a interface precisa naquele ponto específico.

O diagrama abaixo retrata o conceito do padrão BFF:

<img width="1600" height="1097" alt="unnamed" src="https://github.com/user-attachments/assets/c71a1199-3a5d-4bb7-91ce-6ad656d85ac8" />

No caso da Netflix, os melhores amigos eram basicamente um roteiro Groovy para uma tela específica em um dispositivo específico.

Os scripts eram escritos por desenvolvedores de interface, pois eles sabiam exatamente quais dados precisavam para renderizar uma tela específica. Uma vez escritos, os scripts eram implantados em um servidor API e realizavam o fanout para todos os diferentes microsserviços, chamando as bibliotecas clientes Java apropriadas. Essas bibliotecas clientes eram wrappers para um serviço gRPC ou um cliente REST.

O diagrama abaixo mostra essa configuração.

<img width="1600" height="927" alt="unnamed" src="https://github.com/user-attachments/assets/00726f03-70a4-4d75-b855-9c76cd90d135" />

The Use of RxJava and Reactive Programming: Os roteiros do Groovy ajudaram a realizar o lançamento.

Mas fazer esse tipo de expansão em Java não é trivial. A abordagem tradicional era criar vários threads e tentar gerenciar o fanout usando o gerenciamento mínimo de threads.

No entanto, as coisas ficaram complicadas rapidamente por causa da tolerância a falhas. Ao lidar com vários serviços, pode ser que um deles não responda rápido o suficiente ou falha, resultando em uma situação em que você precisa limpar threads e garantir que tudo funcione corretamente.

Foi aí que o RxJava e a programação reativa ajudaram a Netflix a lidar melhor com os fanouts, cuidando de toda a complexidade do gerenciamento de threads.

Além do RxJava, a Netflix criou uma biblioteca tolerante a falhas chamada Hystrix, que cuidava de failover e bulkheading. Embora a programação reativa fosse complicada, fazia muito sentido para a época e a arquitetura permitia atender à maior parte das necessidades de tráfego da Netflix.

No entanto, havia algumas limitações importantes nessa abordagem:

Havia um script para cada endpoint, resultando em muitos scripts para manter e gerenciar

Desenvolvedores de UI tiveram que criar todos os mini backends e não gostaram de trabalhar no espaço Java Groovy com RxJava. Não é a linguagem principal que eles usam diariamente que dificulta as coisas

Programação reativa geralmente é difícil e tem uma curva de aprendizado íngreme.

A Mudança para a Federação GraphQL
Nos últimos anos, a Netflix tem migrado para uma arquitetura completamente nova quando se trata de seus serviços Java. O centro dessa nova arquitetura é a GraphQL Federation.

Quando você compara GraphQL com REST, a principal diferença é que GraphQL sempre tem um esquema. Esse esquema ajuda a definir alguns aspectos-chave como:

Todas as operações, junto com as várias consultas e mutações

Campos disponíveis dos tipos que estão sendo retornados pelas consultas

Por exemplo, no caso da Netflix, você pode ter uma consulta para todos os programas que retornam um tipo de programa. Tem um programa como título e também contém críticas, que podem ser de outro tipo.

Com o GraphQL, o cliente precisa ser explícito sobre a seleção do campo. Você não pode simplesmente pedir por shows e obter todos os dados deles. Em vez disso, você precisa mencionar especificamente que quer obter o título do programa e a nota de várias críticas. Se você não pedir um campo, não vai conseguir o campo.

Com o REST, isso era o oposto, porque você recebia o que o serviço REST decidia enviar.

Embora seja mais trabalho para o cliente especificar a consulta no GraphQL, isso resolve todo o problema de over-fetching, onde você obtém muito mais dados do que realmente precisa. Isso abre caminho para criar uma API única que possa atender todas as diferentes interfaces.

Para complementar o GraphQL, a Netflix foi além e usou a GraphQL Federation para reintegrá-lo em sua arquitetura de microsserviços.

O diagrama abaixo mostra a configuração com o GraphQL Federation.

<img width="1600" height="1152" alt="unnamed" src="https://github.com/user-attachments/assets/79912c5d-c339-434e-82e6-5d7e84455080" />

Como você pode ver, os microserviços agora são chamados de DGS ou Domain Graph Service.

DGS é um framework interno desenvolvido pela Netflix para construir serviços GraphQL. Quando começaram a migrar para GraphQL e GraphQL Federation, não havia nenhum framework Java maduro o suficiente para usar na escala da Netflix. Por isso, eles construíram sobre o framework Java de baixo nível GraphQL e o complementaram com recursos como geração de código para tipos de esquema e suporte para federação.

No seu cerne, um DGS é apenas um microserviço Java com um endpoint GraphQL e um esquema.

Embora existam múltiplos DGSs, existe apenas um grande esquema GraphQL do ponto de vista de um dispositivo como a TV. Esse esquema contém todos os dados possíveis que podem ser renderizados. O dispositivo não precisa se preocupar com todos os diferentes microserviços que fazem parte do esquema no backend.

Por exemplo, a DGS da LOLOMO pode definir um tipo de show apenas com o título. Depois, as imagens que o DGS pode estender esse tipo aparecem e adicionam uma URL de arte a ele. Os dois DGS diferentes não sabem nada um sobre o outro. Tudo o que eles precisam fazer é publicar o esquema deles no gateway federado. O gateway federado sabe como se comunicar com um DGS porque todos eles têm um endpoint GraphQL.

Existem várias vantagens nesse setup:

Não há mais duplicação de APIs.

Não há necessidade de backend para frontend (BFF) porque o GraphQL como API é flexível o suficiente para suportar diferentes dispositivos devido ao recurso de seleção de campos.

Não há necessidade de desenvolvimento do lado do servidor por engenheiros de interface. Os desenvolvedores do backend e os desenvolvedores da interface apenas colaboram no esquema.

Não há mais necessidade de bibliotecas clientes em Java. Isso porque o gateway federado sabe como se comunicar com um serviço genérico GraphQL sem a necessidade de escrever código específico.

Versões em Java na Netflix
Recentemente, a Netflix migrou do Java 8 para o Java 17. Após a migração, eles viram cerca de 20% melhor no uso de CPU no Java 17 do que no Java 8, sem nenhuma alteração no código. Isso se deveu às melhorias no coletor de lixo G1. Na escala da Netflix, uma utilização de CPU 20% melhor é um grande valor em termos de custos.

Ao contrário do que muitos pensam, a Netflix não tem sua própria JVM. Eles estão apenas usando a Azul Zulu JVM, que é uma build do OpenJDK.

No total, a Netflix possui cerca de 2800 aplicações Java que são em sua maioria microserviços de tamanhos variados. Além disso, eles têm cerca de 1500 bibliotecas internas. Algumas delas são bibliotecas reais, enquanto muitas são apenas bibliotecas clientes na frente de um serviço gRPC ou REST.

Para o sistema de build, a Netflix depende do Gradle. Além do Gradle, eles usam o Nebula, que é um conjunto de plugins open-source do Gradle. O aspecto mais importante do Nebula está na resolução das bibliotecas. Nebula ajuda com o bloqueio de versões, o que ajuda com builds reprodutíveis.

Mais recentemente, a Netflix tem testado ativamente e implementado mudanças com Java 21. Comparando a transição do Java 8 para o Java 17, é significativamente fácil passar do Java 17 para o 21. O Java 21 também oferece alguns recursos importantes, tais como:

Threads virtuais permitem que aplicações do lado do servidor, escritas no estilo thread-per-request, escalem com a utilização ideal de hardware. No estilo thread-per-request, uma solicitação chega e o servidor fornece uma thread para ela. Todo o trabalho do pedido acontece neste tópico

Um coletor de lixo ZGC atualizado que foca em tempos de pausa baixos e funciona bem em uma variedade maior de casos de uso.

Programação orientada a dados com uma combinação de registros e correspondência de padrões

Uso da Spring Boot na Netflix: A Netflix é famosa pelo uso do Spring Boot. No último ano, eles deixaram completamente a pilha Java criada no Guice e padronizaram completamente o Spring Boot.

Por que a Spring Boot? É o framework Java mais popular e tem sido muito bem mantido ao longo dos anos.

A Netflix encontrou muitos benefícios ao aproveitar a enorme comunidade open-source do framework Spring, a documentação existente e as oportunidades de treinamento facilmente disponíveis. A evolução de Spring e seus longas se alinham muito bem com o princípio central da Netflix de "altamente alinhado, frouxamente acoplado".

A Netflix usa a versão mais recente do OSS Spring Boot e seu objetivo é se manter o mais próximo possível da comunidade open source. No entanto, para se integrar de perto com o ecossistema e a infraestrutura da Netflix, eles também criaram o Spring Boot Netflix, que é um conjunto de módulos construídos sobre o Spring Boot.

Spring Boot A Netflix oferece suporte para várias coisas, como:

- Cliente gRPC
- Suporte a servidores integrado à pilha SSO da Netflix para AuthZ e AuthN
- Observabilidade na forma de rastreamento, métricas e registro distribuído
- Clientes HTTP que suportam mTLS
- Service Discovery com Eureka
- Integração AWS/Titus
- Integração com Kafka, Cassandra e Zookeeper

A Netflix é uma aula magistral em engenharia backend em grande escala. Por trás da reprodução contínua, recomendações personalizadas e consistência entre dispositivos, existe uma arquitetura complexa alimentada por Java.

A maioria dos serviços de backend da Netflix roda em Java. Isso pode surpreender engenheiros que já assistiram à ascensão de Kotlin, Go, Rust e frameworks reativos. Mas a Netflix não vai continuar com Java por inércia. Java amadureceu, assim como o ecossistema ao seu redor. JVMs modernas oferecem coletores de lixo poderosos. O Spring Boot se tornou tanto extensível quanto confiável. E com a chegada de threads virtuais e concorrência estruturada, o Java está recuperando seu lugar no design de sistemas de alta taxa e baixa latência, sem a sobrecarga da complexidade reativa.

Neste artigo, vamos explicar como a Netflix usa Java hoje. Também abordaremos os seguintes temas:

- A espinha dorsal arquitetônica da Netflix: uma plataforma federada GraphQL que conecta aplicativos clientes a dezenas de serviços backend em Java.

- O modelo de concorrência: como threads virtuais Java e coletores de lixo modernos mudam o desempenho e a confiabilidade.

- A evolução: uma migração em toda a empresa da dívida técnica para Spring Boot, JDK 21+ e além.

Arquitetura Backend com a GraphQL Foundation: No coração do backend da Netflix está uma arquitetura GraphQL federada. Esta é a abstração principal pela qual todas as aplicações clientes interagem com os dados do backend. O modelo oferece tanto flexibilidade quanto isolamento: os clientes podem expressar exatamente o que precisam, e as equipes de backend podem evoluir seus serviços de forma independente.

<img width="1100" height="729" alt="unnamed" src="https://github.com/user-attachments/assets/17e068ef-f380-4d08-984e-91815c9035e4" />

Toda consulta GraphQL de um cliente Netflix, seja de uma smart TV, telefone ou navegador, chega a um API Gateway centralizado. Esse gateway analisa a consulta, decompõe-a em subconsultas e as direciona para os serviços backend apropriados.

Cada equipe backend possui um Domain Graph Service (DGS), que implementa uma fatia do esquema geral do GraphQL. Todo Domain Graph Service (DGS) da Netflix é um aplicativo Spring Boot.

O próprio framework DGS é construído como uma extensão do Spring Boot. Isso significa que suporta os seguintes recursos:

- A injeção de dependências, configuração e gerenciamento do ciclo de vida são gerenciados pelo Spring Boot.

- Resolvers GraphQL são apenas componentes Spring anotados.

- Observabilidade, segurança, lógica de retentativa e integração com malha de serviço são implementadas usando os mecanismos do Spring.

![ed4f8f83-0122-4892-9709-9b000a9281fb_1600x1147](https://github.com/user-attachments/assets/112b6179-86e8-4625-882e-76b86538283a)

A Netflix escolheu Spring Boot porque já está comprovada em escala e é uma tecnologia de longa duração na Netflix. Também é extensível à medida que a Netflix adiciona seus módulos para segurança, métricas, descoberta de serviços e mais.

As DGSs registram seus fragmentos de esquema em um registro compartilhado. O gateway então sabe qual serviço é responsável por qual campo. Isso transforma um esquema "monolítico" em um grafo totalmente federado e implantável de forma independente.

Essa separação da propriedade do esquema possibilita:

- Implantabilidade independente dos serviços
- Colaboração baseada em esquema entre frontend e backend
- Limites mais limpos entre domínios (por exemplo, recomendações vs. perfis de usuário)

A ideia principal é que os serviços backend possuem sua parte do grafo, não apenas seus dados internos.

Microservice Fan-out: What a Query Hits: Nos bastidores, até mesmo uma consulta simples, como buscar títulos e imagens de cinco programas, faz fãs espalhados por vários serviços:

- O API Gateway recebe a solicitação.
- Ele contatou 2–3 DGSs para resolver áreas como metadados, arte e disponibilidade.
- Cada DGS pode então se espalhar novamente para buscar em depósitos de dados ou ligar para outros serviços.

Esse padrão de expansão é essencial para flexibilidade, mas introduz uma complexidade real. O sistema precisa de timeouts agressivos, lógica de retentativa e estratégias de reposição para evitar que um serviço lento se transforme em latência visível para o usuário.

![4e5ae488-425c-443b-a702-bfc2f6857df9_1600x1062](https://github.com/user-attachments/assets/6e7b184d-6794-454c-8ac7-51fbc1e55218)

Protocol Choices: Entre o cliente e o gateway, a Netflix mantém HTTP e GraphQL em protocolos web padrão. Isso garante compatibilidade entre navegadores, aplicativos móveis e smart TVs.

Dentro do backend, os serviços se comunicam via gRPC: um protocolo binário de alto desempenho que suporta chamadas eficientes entre serviços. O gRPC habilita:

- Comunicação de baixa latência
- Tipagem forte via Protocol Buffers
- Evolução fácil da interface

Essa separação faz sentido: o GraphQL é ótimo para busca de dados flexível e orientada pelo cliente, enquanto o gRPC se destaca em interações internas no estilo RPC.

![dd72b09d-b352-420c-9b1e-d08428842768_1600x1062](https://github.com/user-attachments/assets/d19b4d52-7e46-4955-97e1-625345673e34)

Evolução da JVM: Até recentemente, grande parte do código Java da Netflix ficava preso no JDK 8. O problema não era a inércia, mas o bloqueio. Um framework de aplicação personalizado e interno, construído anos antes, acumulou camadas de bibliotecas não mantidas e APIs desatualizadas. Essas dependências tinham acoplamentos apertados e problemas de compatibilidade que tornavam arriscado atualizar qualquer coisa além do JDK 8.

Nesse contexto, os proprietários de serviços não podiam avançar de forma independente. Mesmo quando versões mais novas em Java estavam tecnicamente disponíveis, a plataforma não estava pronta. As equipes tinham pouco incentivo para evoluir porque isso exigia esforço sem benefício imediato. O resultado foi um progresso estagnado em todos os aspectos.

Quebrar esse ciclo exigiu uma abordagem direta. A Netflix corrigiu as bibliotecas incompatíveis em si, não reescrevendo tudo, mas fazendo forks e atualizações mínimas do que era necessário para torná-lo compatível com o JDK-17. Na prática, isso não foi tão assustador quanto parece. No fim das contas, apenas um pequeno número de bibliotecas críticas exigiu intervenção.

Paralelamente, a empresa começou a migrar todos os serviços Java (cerca de 3000) para o Spring Boot. Não foi um simples levantar e mudar. Eles construíram ferramentas automatizadas para transformar código, configurar serviços e padronizar a implantação. Embora o esforço tenha sido significativo, o resultado é uma plataforma unificada que pode evoluir em sintonia com o ecossistema Java mais amplo.

Agora, a linha de base na maioria dos times é Spring Boot no JDK 17 ou mais recente. Alguns serviços legados permanecem para compatibilidade retroativa, mas foram exceção.

Uma vez que os serviços foram transferidos para o JDK 17, os benefícios ficaram evidentes:

- O coletor de lixo G1, já em uso, apresentou uma melhora significativa: cerca de 20% menos tempo de CPU gasto no GC sem alterar o código da aplicação.
- Pausas menos e mais curtas para parar o mundo levaram a menos tempos de espera em cascata em sistemas distribuídos.
- Maior throughput geral e melhor utilização da CPU tornaram-se possíveis, especialmente para serviços de alto RPS.

ZGC Geracional: O coletor de lixo G1 serviu bem à Netflix por anos. Ele encontrava um equilíbrio entre throughput e tempo de pausa, e a maioria dos serviços baseados em JVM o utilizava por padrão. Mas à medida que o tráfego aumentava e os tempos se fechavam, as rachaduras apareciam.

Sob alta concorrência, alguns serviços tiveram pausas de parar o mundo que duravam mais de um segundo, tempo suficiente para causar timeouts de IPC e acionar lógica de retentativa entre serviços dependentes. Essas tentativas inflaram o tráfego, introduziram jitter e obscureceram a causa raiz das falhas. Em clusters rodando com altas cargas de CPU, os picos ocasionais de latência do G1 se tornavam um fardo operacional.

No entanto, a introdução do ZGC geracional mudou o jogo.

O ZGC já estava disponível em versões anteriores em Java, mas não possuía um modelo de memória geracional. Isso limitou sua eficácia para cargas de trabalho onde a maioria das alocações era de curta duração, como nos serviços de streaming da Netflix.

No JDK 21, finalmente chegou a geração ZGC. Ele trouxe um coletor de lixo moderno, com poucas pausas, que também entendia a vida útil do objeto. O efeito foi imediato:

- O tempo de pausa caía quase zero, mesmo sob carga pesada.

- Os serviços não tinham mais tempo de encerramento durante as pausas do GC, o que levou a uma redução visível nas taxas de erro.

- Com menos estojos de coleta de lixo, menos requisições upstream falharam, reduzindo a pressão em todo o cluster.

- Os clusters rodavam mais próximos da saturação da CPU sem cair. A margem de segurança antes reservada para a segurança do GC agora estava disponível para cargas reais de trabalho.

Do ponto de vista do operador, essas melhorias foram significativas. Uma mudança de configuração de uma linha (trocando de G1 para ZGC) se traduziu em comportamento mais suave, menos alertas e escalonamento mais previsível.

Uso de Threads Virtuais Java: No modelo tradicional de concorrência, cada manipulador de requisições roda em um thread separado.

Como funcionam os Java Virtual Threads? Threads Virtuais são threads leves introduzidos no Java 19 (Prévia) e Java 21 (Estável). Eles permitem que o Java crie milhões de threads de forma eficiente, ajudando a lidar com tarefas simultâneas sem desperdiçar memória ou CPU.

![unnamed](https://github.com/user-attachments/assets/bbaf6194-df40-424b-8abf-40b62d102f97)

Threads virtuais não mapeiam 1:1 para as threads do sistema operacional e não substituem as threads originais da plataforma. As Threads de Plataforma são suportadas pelas Threads do SO e às vezes também são conhecidas como Threads de Operadora nesse contexto.

Pense nos Threads de Plataforma como um pequeno grupo de trabalhadores, e nos Threads virtuais como tarefas. Com threads virtuais, as tarefas são atribuídas aos trabalhadores apenas quando necessário, permitindo que um trabalhador gerencie milhares de tarefas de forma eficiente.

Veja como funcionam os Virtual Threads:

1. Threads virtuais rodam sobre Threads de Plataforma. A JVM os agenda em um pequeno número de Threads de Plataforma.

2. Quando uma Thread Virtual inicia, a JVM a atribui a uma Thread de Plataforma normal apoiada pelo sistema operacional.

3. Threads Virtuais também podem lidar com trabalhos intensivos em CPU, mas sua verdadeira vantagem está em cenários com um alto número de tarefas de I/O ou concorrentes.

4. Se a Thread Virtual realiza uma operação de bloqueio (como I/O, chamada de banco de dados, suspensão, etc.), a JVM a desmonta da Thread da Plataforma. No entanto, isso não bloqueia a thread do sistema operacional subjacente propriamente dita.

5. A thread da Plataforma é liberada para gerenciar outra Thread Virtual.

6. Quando a operação de bloqueio termina, a Thread Virtual é reagendada em qualquer thread disponível da Plataforma.

Para sistemas de alta produtividade, isso leva a um alto número de threads, uso inflacionado de memória e sobrecarga de escalonamento. A Netflix enfrentou exatamente essa situação, especialmente em sua pilha GraphQL, onde resolvers de campo individuais podem realizar I/O bloqueadores.

Paralelizar essas chamadas de resolver manualmente era possível, mas doloroso. Os desenvolvedores precisavam raciocinar sobre pools de threads, gerenciar "CompletableFutures" e lidar com a complexidade de misturar modelos bloqueantes e não bloqueantes. A maioria não se preocupava a menos que o desempenho tornasse inevitável.

Com o Java 21+, a Netflix começou a lançar threads virtuais. Essas threads leves, agendadas pela JVM em vez do sistema operacional, permitiam que o código bloqueador escalasse sem monopolizar recursos. Para serviços construídos sobre a estrutura DGS e Spring Boot, a integração era automática. Resolvers agora podiam rodar em paralelo por padrão.

Veja o diagrama abaixo que mostra o conceito de threads virtuais em Java.

Uso de Threads Virtuais Java: No modelo tradicional de concorrência, cada manipulador de requisições roda em um thread separado.

Para sistemas de alta produtividade, isso leva a um alto número de threads, uso inflacionado de memória e sobrecarga de escalonamento. A Netflix enfrentou exatamente essa situação, especialmente em sua pilha GraphQL, onde resolvers de campo individuais podem realizar I/O bloqueadores.

Paralelizar essas chamadas de resolver manualmente era possível, mas doloroso. Os desenvolvedores precisavam raciocinar sobre pools de threads, gerenciar "CompletableFutures" e lidar com a complexidade de misturar modelos bloqueantes e não bloqueantes. A maioria não se preocupava a menos que o desempenho tornasse inevitável.

Com o Java 21+, a Netflix começou a lançar threads virtuais. Essas threads leves, agendadas pela JVM em vez do sistema operacional, permitiam que o código bloqueador escalasse sem monopolizar recursos. Para serviços construídos sobre a estrutura DGS e Spring Boot, a integração era automática. Resolvers agora podiam rodar em paralelo por padrão.

Veja o diagrama abaixo que mostra o conceito de threads virtuais em Java:

![17ec33d3-6394-485b-acca-f9381bd29533_1600x1061](https://github.com/user-attachments/assets/b1d1b1fb-6d26-47d9-bb22-4403b75e9573)

Pegue o exemplo comum de uma consulta GraphQL que retorna cinco programas, cada um exigindo dados de arte. Anteriormente, o resolver que buscava URLs de arte rodava em série, adicionando latência entre múltiplas chamadas. Com threads virtuais, essas chamadas agora são executadas em paralelo, reduzindo significativamente o tempo total de resposta, sem alterar o código da aplicação.

A Netflix conectou suporte a threads virtuais diretamente em seus frameworks:

- Serviços baseados em Spring Boot se beneficiam automaticamente da execução paralela em resolvers de campo.

- Desenvolvedores não precisam usar novas APIs ou alterar anotações.

- O modelo de escalonamento de threads permanece abstrato, preservando fluxos de trabalho de desenvolvimento familiares.

Esse modelo de opt-in por padrão funciona porque threads virtuais impõem quase nenhuma sobrecarga. A JVM os gerencia de forma eficiente, tornando-os adequados mesmo em caminhos de alto volume onde modelos tradicionais de thread-per-request falham.

Trade-Offs: Threads virtuais não são mágica. Experimentos iniciais revelaram um modo de falha específico: bloqueios causados pelo fixação de thread.

Veja o que aconteceu:

- Algumas bibliotecas usavam blocos ou métodos sincronizados.
- Quando uma thread virtual entra em um bloco sincronizado, ela passa a ser fixada a uma thread física da plataforma.
- Se muitas threads virtuais fixadas bloquearem enquanto seguram locks, e o pool de threads da plataforma for esgotado, o sistema pode travar. Nenhuma thread pode avançar, porque a thread que segura o lock não pode ser agendada.

A Netflix enfrentou exatamente esse cenário na produção.

O problema era sério o suficiente para que a Netflix recuasse temporariamente na adoção agressiva de threads virtuais. Mas com o JDK 24, esse problema foi resolvido diretamente: a JVM reescreveu o interno do sincronizado para evitar fixação desnecessária de threads.

Com essa mudança, a equipe de engenharia pôde avançar novamente. Os ganhos de desempenho e simplicidade são bons demais para serem ignorados, e agora o risco foi significativamente reduzido.

Why Netflix Moved Away from RxJava?

A Netflix ajudou a pioneirar a programação reativa no ecossistema Java. A RX Java, uma das primeiras e mais influentes bibliotecas reativas, nasceu internamente. Por anos, abstrações reativas moldaram a forma como os serviços lidavam com cargas de trabalho de alta concorrência.

A programação reativa se destaca quando aplicada de ponta a ponta: E/S de rede, computação e armazenamento de dados todos envolvidos em fluxos não bloqueantes e orientados por eventos. Mas esse modelo exige total adesão. Na prática, a maioria dos sistemas fica em algum lugar intermediário: algumas bibliotecas assíncronas, outras bloqueando IOs e muito código legado. O resultado é uma mistura frágil de modelos de concorrência que é difícil de raciocinar, difícil de depurar e fácil de errar.

Um ponto problemático frequente era combinar um modelo thread-per-request com um cliente HTTP reativo como o WebClient. Mesmo quando funcionava, introduzia duas camadas de concorrência (uma bloqueadora e outra não bloqueadora), criando modos de falha complexos e contenção de recursos. Era eficaz para certos casos de expansão por dispersão, mas operacionalmente cara.

A introdução de threads virtuais mudou a equação. Como mencionado, eles permitiram milhares de operações de bloqueio simultâneas sem a sobrecarga dos threads tradicionais. Combinado com concorrência estruturada, os desenvolvedores podem expressar fluxos de trabalho assíncronos complexos usando código simples, sem o inferno de retorno de chamadas da programação reativa.

Dito isso, a programação reativa ainda tem seu lugar. Em serviços com cadeias longas de IO, preocupações com backpressure ou cargas de trabalho em streaming, APIs reativas continuam sendo úteis. No entanto, para a maior parte do backend da Netflix, que envolve chamadas RPC, joins em memória e tempos de resposta apertados, threads virtuais e concorrência estruturada oferecem os mesmos benefícios, mas com menor complexidade.

The Spring Boot Netflix Stack

A Netflix padroniza seus serviços de backend no Spring Boot, não como um framework pronto, mas como base para uma plataforma profundamente integrada e extensível. Todo serviço roda no que a equipe chama de "Spring Boot Netflix": uma pilha curada de módulos que sobrepõem infraestrutura específica da empresa ao ecossistema familiar da Spring.

Esse design mantém o modelo de programação limpo. Desenvolvedores usam anotações e expressões expressivas padrão do Spring. Por trás do capô, a Netflix insere lógica personalizada para tudo, desde autenticação até descoberta de serviços.

A Spring Boot Stack da Netflix inclui:

- Integração de segurança com os sistemas de autenticação e autorização da Netflix, exposta por meio de anotações padrão da Spring Security como @Secured e @PreAuthorize.

- Suporte à observabilidade usando as APIs Micrometer da Spring, conectadas a pipelines internos de rastreamento, métricas e logs construídos para lidar com telemetria em escala da Netflix.

- Integração com malha de serviço para todo o tráfego via um sistema baseado em proxy (construído sobre ProxyD), lidando com TLS, descoberta de serviços e políticas de retentativa de forma transparente.

- framework gRPC baseado em modelos de programação orientados por anotação, permitindo que engenheiros escrevam serviços gRPC com a mesma abordagem dos controladores REST.

- Configuração dinâmica com "propriedades rápidas": configurações alteráveis em tempo de execução que evitam reinicializações de serviço e permitem ajustes ao vivo durante incidentes.

- Clientes retryables envolveram gRPC e WebClient para impor timeouts, tentativas e estratégias de reposição logo de cara.

A Netflix permanece alinhada com o Spring Boot no montante. Versões menores chegam à frota em poucos dias. Para lançamentos principais, a equipe constrói ferramentas e camadas de compatibilidade para suavizar o caminho de atualização.

A mudança para o Spring Boot 3 exigiu migrar de javax.* para jakarta.* namespaces. Foi uma mudança que afetou muitas bibliotecas. Em vez de esperar por atualizações externas, a Netflix desenvolveu um plugin Gradle que realiza transformações de bytecode em tempo de resolução de artefatos. Esse plugin reescreve classes compiladas para usar as novas APIs de Jacarta, permitindo que bibliotecas da era Spring Boot 2 funcionem no Spring Boot 3 sem alterações na fonte.

- https://www.infoq.com/presentations/netflix-java/?utm_source=substack&utm_medium=email

- https://youtu.be/5dpLVvRpPPs