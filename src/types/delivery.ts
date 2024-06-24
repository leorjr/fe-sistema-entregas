export interface Coordenadas {
  lat: string;
  long: string;
}

export interface Entrega {
  id: number;
  nome: string;
  data: Date;
  partida: Coordenadas;
  destino: Coordenadas;
}

export interface CreateEntregaRequest {
  nome: string;
  data: Date;
  partida: Coordenadas;
  destino: Coordenadas;
}