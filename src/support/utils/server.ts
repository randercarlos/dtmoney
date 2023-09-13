import { Transaction } from './../interfaces/transaction.interface';
import { createServer, Model, Response } from 'miragejs';

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,
    models: {
      transaction: Model,
    },

    // seeds(server: any) {
    //   server.db.loadData({
    //     transactions: [
    //       {
    //         id: 1,
    //         title: 'Freelancer de WebSite',
    //         type: 'deposit',
    //         category: 'Dev',
    //         amount: 6000.0,
    //         createdAt: new Date('2022-08-18 09:00:00'),
    //       },
    //       {
    //         id: 2,
    //         title: 'Renda de investimentos',
    //         type: 'deposit',
    //         category: 'Renda',
    //         amount: 1231.34,
    //         createdAt: new Date('2022-08-18 09:00:00'),
    //       },
    //     ],
    //   });
    // },

    routes() {
      this.timing = 1000;

      this.get('/transactions', () => {
        return this.schema.all('transaction');
      });

      this.put('/transactions/:id', (schema, request): any => {
        const id = request.params.id;
        const data = { ...JSON.parse(request.requestBody), createdAt: new Date() };

        return this.schema.find('transaction', id)?.update(data);
      });

      this.delete('/transactions/:id', (schema, request): any => {
        const id = request.params.id;

        return this.schema.find('transaction', id)?.destroy();
      });

      this.post(
        '/transactions',
        (schema: any, request: any) => {
          console.log('REQUEST BODY', request.requestBody);
          const data = {
            ...JSON.parse(request.requestBody),
            id: Math.floor(Math.random() * 100),
            createdAt: new Date(),
          };

          if (schema.findBy('transaction', { title: data.title })) {
            return new Response(
              422,
              {},
              { errors: [`A transaction with title "${data.title}" already exists.`] }
            );
          }

          return schema.create('transaction', data);
        },
        { timing: 2000 }
      );
    },
  });
}
