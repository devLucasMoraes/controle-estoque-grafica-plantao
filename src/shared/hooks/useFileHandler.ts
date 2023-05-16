import { XMLParser } from 'fast-xml-parser';
import { useEffect, useRef, useState } from 'react';
import { INfeProc } from '../interfaces';
import { IDetalhamentoTransacoesEntrada } from '../services/api/transacoesEntrada/TransacoesEntradaService';

type GetIdporCnpjFunc = (cnpj: string) => Promise<number | undefined>;

export const useFileHandler = (getFornecedoraNfeId: GetIdporCnpjFunc, getTransportadoraNfeId: GetIdporCnpjFunc) => {
    const [fileData, setFileData] = useState<IDetalhamentoTransacoesEntrada>();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            //const modalidadeFrete = jsonObj.nfeProc.NFe.infNFe.transp.modFrete;
            const itensNfe = jsonObj.nfeProc.NFe.infNFe.det;
            const totaisNfe = jsonObj.nfeProc.NFe.infNFe.total;



            const xmlImportData: IDetalhamentoTransacoesEntrada = {
                id: Math.random(),
                nfe: chaveNfe,
                data_emissao: dataEmissaoNfe,
                data_recebimento: '',
                valor_total: totaisNfe.ICMSTot.vNF,
                valor_frete: totaisNfe.ICMSTot.vFrete,
                valor_ipi_total: totaisNfe.ICMSTot.vIPI,
                obs: '',
                transportadora_id: await getTransportadoraNfeId(transportadoraNfe.CNPJ) ?? 0,
                fornecedora_id: await getFornecedoraNfeId(fornecedoraNfe.CNPJ) ?? 0,
                itens: []
            };

            itensNfe.map(item => {
                xmlImportData.itens.push({
                    id: Math.random(),
                    materiais_id: 1,
                    und_com: item.prod.uCom,
                    quant_com: item.prod.qCom,
                    valor_unt_com: item.prod.vUnCom,
                    valor_ipi: item.imposto.IPI.IPITrib?.vIPI ?? 0
                });
            });

            setFileData(xmlImportData);
        };
        reader.readAsText(file);
    };

    /* esse trecho de código é responsável por adicionar um event listener ao elemento de input de arquivo, que chama a função handleFileChange sempre que ocorre um evento de alteração no elemento. Ele também garante que o event listener seja removido adequadamente quando o componente for desmontado, evitando vazamentos de memória ou comportamento indesejado */
    useEffect(() => {
        if (fileInputRef.current) {
            const fileInput = fileInputRef.current;

            const handleChange = (e: Event) => {
                handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
            };

            fileInput.addEventListener('change', handleChange);

            return () => {
                fileInput.removeEventListener('change', handleChange);
            };
        }
    }, []);

    return {
        fileData,
        fileInputRef,
        handleFileChange
    };
};
