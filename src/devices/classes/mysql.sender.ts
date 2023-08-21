import * as mysql2 from 'mysql2';

export class MysqlSender {
  private connection: any;

  constructor() {
    this.connection = mysql2.createConnection({
      host: '90.189.219.176',
      port: 3306,
      user: 'ferr',
      password: 'superpass',
      database: 'ocw',
    });
  }

  makeQuery(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  destroy() {
    this.connection.destroy();
  }
}
