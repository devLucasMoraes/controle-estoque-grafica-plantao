import { XMLParser } from 'fast-xml-parser';
import { useEffect, useRef, useState } from 'react';
import { INfeProc } from '../interfaces';
import { IDetalhamentoTransacoesEntrada } from '../services/api/transacoesEntrada/TransacoesEntradaService';
import { IFornecedorasFormData } from '../services/api/fornecedoras/FornecedorasService';
import { ITransportadoraFormData } from '../services/api/transportadoras/TransportadorasService';

type GetIdporCnpjFunc = (cnpj: string) => Promise<number | undefined>;
type GetIdporCodProdFunc = (codProd: string) => Promise<number | undefined>;

export const useFileHandler = (getFornecedoraNfeId: GetIdporCnpjFunc, getTransportadoraNfeId: GetIdporCnpjFunc, getMaterialNfeId: GetIdporCodProdFunc) => {
    const [fileData, setFileData] = useState<IDetalhamentoTransacoesEntrada>();
    const [fornecedoraFileData, setFornecedoraFileData] = useState<Omit<IFornecedorasFormData, 'id'>>();
    const [transportadoraFileData, setTransportadoraFileData] = useState<Omit<ITransportadoraFormData, 'id'>>();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const parser = new XMLParser({
            numberParseOptions: {
                eNotation: false,
                leadingZeros: false,
                hex: false
            }
        });

        const reader = new FileReader();
        reader.onload = async () => {
            const fileContent = reader.result?.toString() ?? '';
            const jsonObj: INfeProc = parser.parse(fileContent);

            const chaveNfe = jsonObj.nfeProc.protNFe.infProt.chNFe;
            const dataEmissaoNfe = jsonObj.nfeProc.NFe.infNFe.ide.dhEmi;
            const fornecedoraNfe = jsonObj.nfeProc.NFe.infNFe.emit;
            const transportadoraNfe = jsonObj.nfeProc.NFe.infNFe.transp.transporta;
            const itensNfe = jsonObj.nfeProc.NFe.infNFe.det;
            const totaisNfe = jsonObj.nfeProc.NFe.infNFe.total;

            const fornecedoraImportData: Omit<IFornecedorasFormData, 'id'> = {
                cnpj: fornecedoraNfe.CNPJ,
                nomeFantasia: fornecedoraNfe.xFant,
                razaoSocial: fornecedoraNfe.xNome,
                fone: fornecedoraNfe.enderEmit.fone.toString()
            };
            setFornecedoraFileData(fornecedoraImportData);

            const transportadoraImportData: Omit<IFornecedorasFormData, 'id'> = {
                cnpj: transportadoraNfe.CNPJ,
                nomeFantasia: '',
                razaoSocial: transportadoraNfe.xNome,
                fone: ''
            };
            setTransportadoraFileData(transportadoraImportData);

            const idTransportadora = await getTransportadoraNfeId(transportadoraNfe.CNPJ) ?? -1;
            const idFornecedora = await getFornecedoraNfeId(fornecedoraNfe.CNPJ) ?? -1;


            const xmlImportData: IDetalhamentoTransacoesEntrada = {
                id: Math.random(),
                nfe: chaveNfe,
                dataEmissao: dataEmissaoNfe,
                dataRecebimento: '',
                valorTotal: totaisNfe.ICMSTot.vNF,
                valorFrete: totaisNfe.ICMSTot.vFrete,
                valorIpiTotal: totaisNfe.ICMSTot.vIPI,
                obs: '',
                idTransportadora: idTransportadora,
                idFornecedora: idFornecedora,
                itens: []
            };

            itensNfe.map(async (item) => (
                xmlImportData.itens.push({
                    id: Math.random(),
                    xProd: item.prod.xProd,
                    qtdeEstoque: 0,
                    idMaterial: await getMaterialNfeId(item.prod.cProd) ?? -1,
                    undCom: item.prod.uCom,
                    quantCom: item.prod.qCom,
                    valorUntCom: item.prod.vUnCom,
                    valorIpi: item.imposto.IPI.IPITrib?.vIPI ?? 0
                })
            ));

            setFileData(xmlImportData);
        };
        reader.readAsText(file);
    };

    /* esse trecho de código é responsável por adicionar um event listener ao elemento de input de arquivo, que chama a função handleFileChange sempre que ocorre um evento de alteração no elemento. Ele também garante que o event listener seja removido adequadamente quando o componente for desmontado, evitando vazamentos de memória ou comportamento indesejado */
    useEffect(() => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            const handleChange = (e: Event) => {
                handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
            };
            fileInput.addEventListener('change', handleChange);
            return () => {
                fileInput.removeEventListener('change', handleChange);
            };
        }
    }, [fileInputRef]);

    return {
        fileData,
        fornecedoraFileData,
        transportadoraFileData,
        fileInputRef,
        handleFileChange
    };
};