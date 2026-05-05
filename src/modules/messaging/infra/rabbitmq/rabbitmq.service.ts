import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Channel, ChannelModel } from "amqplib";
import * as amqplib from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: ChannelModel;
  private channel: Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      const url = this.configService.getOrThrow<string>("RABBITMQ_URL");
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      this.logger.log("RabbitMQ connection established");
    } catch (_error) {
      this.logger.warn("RabbitMQ not available, skipping connection");
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch {
      this.logger.warn("Error closing RabbitMQ connection");
    }
  }

  getChannel(): Channel | null {
    return this.channel;
  }

  isConnected(): boolean {
    return this.channel !== undefined;
  }

  async assertExchange(name: string, type: string = "direct"): Promise<void> {
    if (!this.channel) return;
    await this.channel.assertExchange(name, type, { durable: true });
  }

  async assertQueue(queueName: string): Promise<void> {
    if (!this.channel) return;
    await this.channel.assertQueue(queueName, { durable: true });
  }

  async bindQueue(queueName: string, exchangeName: string, routingKey: string): Promise<void> {
    if (!this.channel) return;
    await this.channel.bindQueue(queueName, exchangeName, routingKey);
  }

  async publish(exchangeName: string, routingKey: string, data: unknown): Promise<void> {
    if (!this.channel) return;
    this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );
  }

  async consume(queueName: string): Promise<{ event: string; data: Record<string, unknown> } | null> {
    if (!this.channel) return null;
    
    const msg = await this.channel.get(queueName, { noAck: false });
    if (!msg) return null;

    const content = JSON.parse(msg.content.toString());
    this.channel.ack(msg);
    return content;
  }
}