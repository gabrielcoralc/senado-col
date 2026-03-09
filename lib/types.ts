export interface ElectionData {
  elec: string;
  amb: string;
  tope: string;
  numact: string;
  numdep: string;
  mdhm: string;
  totales: {
    act: {
      metota: string;
      mesesc: string;
      pmesesc: string;
      votant: string;
      pvotant: string;
      votnul: string;
      pvotnul: string;
      votnma: string;
      pvotnma: string;
      votblan: string;
      pvotblan: string;
      votval: string;
      pvotval: string;
    };
  };
  camaras: Camera[];
  historico: HistoricalData[];
}

export interface Camera {
  cam: string;
  cir: string;
  totales: {
    act: {
      votant: string;
      pvotant: string;
      votnul: string;
      pvotnul: string;
      votnma: string;
      pvotnma: string;
      votbla: string;
      pvotbla: string;
      votcan: string;
      pvotcan: string;
      votval: string;
      pvotval: string;
    };
  };
  partotabla: PartyData[];
}

export interface PartyData {
  act: {
    codpar: string;
    cam: string;
    vot: string;
    pvot: string;
    carg: string;
    cantotabla?: CandidateData[];
  };
}

export interface CandidateData {
  amb: string;
  codcan: string;
  cedula: string;
  nomcan: string;
  apecan: string;
  nomcan2: string;
  apecan2: string;
  vot: string;
  pvot: string;
  carg: string;
  pref: string;
  empate: string;
}

export interface HistoricalData {
  numact: string;
  numdep: string;
  mdhm: string;
  mesesc: string;
  mesfalt: string;
  pvotant: string;
}
