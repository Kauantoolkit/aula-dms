# Implementação de Filas RabbitMQ com NestJS

## 1. Instalação

```bash
npm install @nestjs/microservices amqplib amqp-connection-manager
```

---

## 2. Variáveis de Ambiente

Adicione no `.env`:

```env
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

---

## 3. Estrutura de Arquivos (módulo enrollment)

```
src/modules/enrollment/
├── infra/
│   └── messaging/
│       ├── enrollment.publisher.ts      # publica eventos de matrícula
│       └── enrollment.consumer.ts      # consome eventos externos
├── enrollment.module.ts
```

---

## 4. Configurando o Módulo como Publisher e Consumer

### `enrollment.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnrollmentPublisher } from './infra/messaging/enrollment.publisher';
import { EnrollmentConsumer } from './infra/messaging/enrollment.consumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: '',           // publisher não precisa de fila
          noAck: true,
          persistent: true,
        },
      },
    ]),
  ],
  providers: [EnrollmentPublisher, EnrollmentConsumer],
})
export class EnrollmentModule {}
```

---

## 5. Publisher — Publicando Eventos

O serviço `enrollment` publica nas seguintes exchanges:

| Exchange | Routing Key |
|---|---|
| `enrollment.created.exchange` | `enrollment.created` |
| `enrollment.canceled.exchange` | `enrollment.canceled` |

### `enrollment.publisher.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EnrollmentPublisher {
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  publishEnrollmentCreated(payload: unknown) {
    return this.client.emit('enrollment.created', payload);
  }

  publishEnrollmentCanceled(payload: unknown) {
    return this.client.emit('enrollment.canceled', payload);
  }
}
```

> O `emit` publica a mensagem sem aguardar resposta (fire-and-forget).

---

## 6. Consumer — Consumindo Eventos Externos

O serviço `enrollment` consome das seguintes filas:

| Fila | Exchange vinculada | Routing Key |
|---|---|---|
| `enrollment.academic-students.created.queue` | `academic.students.created.exchange` | `student.created` |
| `enrollment.academic-students.updated.queue` | `academic.students.updated.exchange` | `student.updated` |
| `enrollment.academic-students.deleted.queue` | `academic.students.deleted.exchange` | `student.deleted` |
| `enrollment.class-offering.created.queue` | `class-offering.created.exchange` | `class-offering.created` |
| `enrollment.class-offering.updated.queue` | `class-offering.updated.exchange` | `class-offering.updated` |
| `enrollment.class-offering.canceled.queue` | `class-offering.canceled.exchange` | `class-offering.canceled` |

### `enrollment.consumer.ts`

```typescript
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EnrollmentConsumer {

  @EventPattern('student.created')
  handleStudentCreated(@Payload() data: unknown) {
    console.log('student.created recebido:', data);
    // sincronizar estudante localmente
  }

  @EventPattern('student.updated')
  handleStudentUpdated(@Payload() data: unknown) {
    console.log('student.updated recebido:', data);
  }

  @EventPattern('student.deleted')
  handleStudentDeleted(@Payload() data: unknown) {
    console.log('student.deleted recebido:', data);
  }

  @EventPattern('class-offering.created')
  handleClassOfferingCreated(@Payload() data: unknown) {
    console.log('class-offering.created recebido:', data);
  }

  @EventPattern('class-offering.updated')
  handleClassOfferingUpdated(@Payload() data: unknown) {
    console.log('class-offering.updated recebido:', data);
  }

  @EventPattern('class-offering.canceled')
  handleClassOfferingCanceled(@Payload() data: unknown) {
    console.log('class-offering.canceled recebido:', data);
  }
}
```

---

## 7. Registrando o Consumer no `main.ts`

Para o NestJS escutar as filas, é necessário conectar um microservice no bootstrap:

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Consumer: conecta às filas de entrada do enrollment
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queues: [
        'enrollment.academic-students.created.queue',
        'enrollment.academic-students.updated.queue',
        'enrollment.academic-students.deleted.queue',
        'enrollment.class-offering.created.queue',
        'enrollment.class-offering.updated.queue',
        'enrollment.class-offering.canceled.queue',
      ],
      noAck: false,
      persistent: true,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
```

---

## 8. Fluxo Completo do Enrollment

```
[academic.students] ──student.created──► enrollment.academic-students.created.queue ──► handleStudentCreated()
[academic.students] ──student.updated──► enrollment.academic-students.updated.queue ──► handleStudentUpdated()
[academic.students] ──student.deleted──► enrollment.academic-students.deleted.queue ──► handleStudentDeleted()

[class-offering] ──class-offering.created──► enrollment.class-offering.created.queue ──► handleClassOfferingCreated()
[class-offering] ──class-offering.updated──► enrollment.class-offering.updated.queue ──► handleClassOfferingUpdated()
[class-offering] ──class-offering.canceled──► enrollment.class-offering.canceled.queue ──► handleClassOfferingCanceled()

[enrollment] ──enrollment.created──► enrollment.created.exchange ──► (attendance consome)
[enrollment] ──enrollment.canceled──► enrollment.canceled.exchange ──► (attendance consome)
```

---

## 9. Convenção de Nomenclatura (resumo)

| Elemento | Padrão | Exemplo |
|---|---|---|
| Exchange | `{producer}.{event}.exchange` | `enrollment.created.exchange` |
| Fila | `{consumer}.{producer}.{event}.queue` | `enrollment.academic-students.created.queue` |
| Routing Key | `{entity}.{action}` | `enrollment.created` |

> Separador lógico: `.` (ponto) · Separador em nomes compostos: `-` (hífen) · Tudo lowercase
