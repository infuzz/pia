import { ApplicationDb } from '../../../application.db';

export class Answer extends ApplicationDb {
  public id: number;
  public data: { text: string, gauge: number, list: string[] };

  constructor() {
    super(201707071818, 'answer');
  }

  async create() {
    const data = {
          pia_id: this.pia_id,
          reference_to: this.reference_to,
          data: this.data,
          created_at: new Date()
        };
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        const formData = new FormData();
        for (const d in data) {
          if (d === 'data') {
            for (const d2 in data[d]) {
              if (data[d].hasOwnProperty(d2)) {
                formData.append('answer[data][' + d2 + ']', data[d][d2]);
              }
            }
          } else {
            formData.append('answer[' + d + ']', data[d]);
          }
        }
        fetch(this.getServerUrl(), {
          method: 'POST',
          body: formData
        }).then((response) => {
          return response.json();
        }).then((result: any) => {
          this.id = result.id;
          resolve();
        }).catch ((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          this.objectStore.add(data).onsuccess = (event: any) => {
            this.id = event.target.result;
            resolve();
          };
        });
      }
    });
  }

  async update() {
    return new Promise((resolve, reject) => {
      this.find(this.id).then((entry: any) => {
        entry.data = this.data;
        entry.updated_at = new Date();
        if (this.serverUrl) {
          const formData = new FormData();
          for (const d in entry) {
            if (entry.hasOwnProperty(d)) {
              if (entry[d] instanceof Object) {
                for (const dd in entry[d]) {
                  if (entry[d].hasOwnProperty(dd)) {
                    formData.append('answer[' + d + '][' + dd + ']', entry[d][dd]);
                  }
                }
              } else {
                formData.append('answer[' + d + ']', entry[d]);
              }
            }
          }
          fetch(this.getServerUrl() + '/' + this.id, {
            method: 'PATCH',
            body: formData
          }).then((response) => {
            return response.json();
          }).then((result: any) => {
            resolve();
          }).catch ((error) => {
            console.error('Request failed', error);
          });
        } else {
          this.getObjectStore().then(() => {
            this.objectStore.put(entry).onsuccess = () => {
              resolve();
            };
          });
        }
      });
    });
  }

  async get(id: number) {
    this.id = id;
    return new Promise((resolve, reject) => {
      this.find(this.id).then((entry: any) => {
        this.pia_id = parseInt(entry.pia_id, 10);
        this.reference_to = entry.reference_to;
        this.data = entry.data;
        this.created_at = new Date(entry.created_at);
        this.updated_at = new Date(entry.updated_at);
        resolve();
      });
    });
  }

  async getByReferenceAndPia(pia_id: number, reference_to: any) {
    this.pia_id = pia_id;
    this.reference_to = reference_to;
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl() + '?reference_to=' + this.reference_to).then((response) => {
          return response.json();
        }).then((result: any) => {
          if (result) {
            this.id = result.id;
            this.reference_to = result.reference_to;
            this.data = result.data;
            this.created_at = new Date(result.created_at);
            this.updated_at = new Date(result.updated_at);
          }
          resolve();
        }).catch ((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          const index1 = this.objectStore.index('index1');
          index1.get(IDBKeyRange.only([this.pia_id, this.reference_to])).onsuccess = (event: any) => {
            const entry = event.target.result;
            if (entry) {
              this.id = entry.id;
              this.reference_to = entry.reference_to;
              this.data = entry.data;
              this.created_at = new Date(entry.created_at);
              this.updated_at = new Date(entry.updated_at);
            }
            resolve();
          }
        });
      }
    });
  }

  async findAllByPia(pia_id: number) {
    const items = [];
    this.pia_id = pia_id;
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl()).then((response) => {
          return response.json();
        }).then((result: any) => {
          resolve(result);
        }).catch ((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          const index1 = this.objectStore.index('index2');
          index1.openCursor(IDBKeyRange.only(this.pia_id)).onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
              items.push(cursor.value);
              cursor.continue();
            } else {
              resolve(items);
            }
          }
        });
      }
    });
  }

  async getGaugeByPia(pia_id: number) {
    const items = [];
    this.pia_id = pia_id;
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl()).then((response) => {
          return response.json();
        }).then((result: any) => {
          resolve(result);
        }).catch ((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          const index2 = this.objectStore.index('index2');
          index2.openCursor(IDBKeyRange.only(this.pia_id)).onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
              items.push(cursor.value);
              cursor.continue();
            } else {
              resolve(items);
            }
          }
        });
      }
    });
  }
}
