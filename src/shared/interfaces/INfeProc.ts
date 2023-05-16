export interface INfeProc {
    nfeProc: {
        NFe: {
            infNFe: {
                ide: {
                    cUF: number;
                    cNF: number;
                    natOp: string;
                    mod: number;
                    serie: number;
                    nNF: number;
                    dhEmi: string;
                    tpNF: number;
                    idDest: number;
                    cMunFG: number;
                    tpImp: number;
                    tpEmis: number;
                    cDV: number;
                    tpAmb: number;
                    finNFe: number;
                    indFinal: number;
                    indPres: number;
                    procEmi: number;
                    verProc: string;
                };
                emit: {
                    CNPJ: string;
                    xNome: string;
                    xFant: string;
                    enderEmit: {
                        xLgr: string;
                        nro: number;
                        xBairro: string;
                        cMun: number;
                        xMun: string;
                        UF: string;
                        CEP: number;
                        cPais: number;
                        xPais: string;
                        fone: number;
                    };
                    IE: number;
                    IM: number;
                    CNAE: number;
                    CRT: number;
                };
                dest: {
                    CNPJ: string;
                    xNome: string;
                    enderDest: {
                        xLgr: string;
                        nro: number;
                        xBairro: string;
                        cMun: number;
                        xMun: string;
                        UF: string;
                        CEP: number;
                        cPais: number;
                        xPais: string;
                        fone: number;
                    };
                    indIEDest: number;
                    IE: number;
                    email: string;
                };
                det: {
                    prod: {
                        cProd: number;
                        cEAN: number;
                        xProd: string;
                        NCM: number;
                        CFOP: number;
                        uCom: string;
                        qCom: number;
                        vUnCom: number;
                        vProd: number;
                        cEANTrib: number;
                        uTrib: string;
                        qTrib: number;
                        vUnTrib: number;
                        indTot: number;
                    };
                    imposto: {
                        ICMS: {
                            ICMS00: {
                                orig: number;
                                CST: number;
                                modBC: number;
                                vBC: number;
                                pICMS: number;
                                vICMS: number;
                            };
                        };
                        IPI: {
                            cEnq: number;
                            IPINT?: {
                                CST: number;
                            };
                            IPITrib?: {
                                CST: number;
                                vBC: number;
                                pIPI: number;
                                vIPI: number;
                            };
                        };
                        PIS: {
                            PISAliq: {
                                CST: number;
                                vBC: number;
                                pPIS: number;
                                vPIS: number;
                            };
                        };
                        COFINS: {
                            COFINSAliq: {
                                CST: number;
                                vBC: number;
                                pCOFINS: number;
                                vCOFINS: number;
                            };
                        };
                    };
                }[];
                total: {
                    ICMSTot: {
                        vBC: number;
                        vICMS: number;
                        vICMSDeson: number;
                        vFCP: number;
                        vBCST: number;
                        vST: number;
                        vFCPST: number;
                        vFCPSTRet: number;
                        vProd: number;
                        vFrete: number;
                        vSeg: number;
                        vDesc: number;
                        vII: number;
                        vIPI: number;
                        vIPIDevol: number;
                        vPIS: number;
                        vCOFINS: number;
                        vOutro: number;
                        vNF: number;
                    };
                };
                transp: {
                    modFrete: 0 | 1 | 2 | 3 | 4 | 9;
                    transporta: {
                        CNPJ: string;
                        xNome: string;
                        IE: string;
                        xEnder: string;
                        xMun: string;
                        UF: string;
                    };
                    vol: {
                        qVol: number;
                        pesoL: number;
                        pesoB: number;
                    };
                };
                cobr: {
                    fat: {
                        nFat: string;
                        vOrig: number;
                        vDesc: number;
                        vLiq: number;
                    };
                    dup: {
                        nDup: string;
                        dVenc: string;
                        vDup: number;
                    };
                };
                pag: {
                    detPag: {
                        indPag: number,
                        tPag: number,
                        vPag: number
                    };
                };
                infAdic: {
                    infCpl: string
                };
            };
        };
        protNFe: {
            infProt: {
                tpAmb: number,
                verAplic: string,
                chNFe: string,
                dhRecbto: string,
                nProt: number,
                digVal: string,
                cStat: number,
                xMotivo: string
            };
        };
    };
}