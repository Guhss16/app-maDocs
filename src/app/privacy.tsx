import SecondaryView from "@/components/layout/secondary-view";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

const H = ({ children }: { children: ReactNode }) => (
  <Text className="mt-2 text-lg font-semibold text-azul-primario">
    {children}
  </Text>
);

const P = ({ children }: { children: ReactNode }) => (
  <Text className="text-base leading-6 text-gray-700">{children}</Text>
);

const B = ({ children }: { children: ReactNode }) => (
  <Text className="font-semibold">{children}</Text>
);

const Li = ({ children }: { children: ReactNode }) => (
  <View className="flex-row gap-2 pl-2">
    <Text className="text-base text-gray-700">•</Text>
    <Text className="flex-1 text-base leading-6 text-gray-700">{children}</Text>
  </View>
);

export default function PrivacyPolicy() {
  return (
    <SecondaryView
      labelControls="Política de Privacidade"
      scrollable={false}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-3 pb-10">
          <Text className="text-2xl font-semibold text-azul-primario">
            Política de Privacidade e Tratamento de Dados Pessoais
          </Text>
          <Text className="text-sm text-gray-500">
            App maDocs · Versão 1.0 · Última atualização: 30/10/2026
          </Text>

          <H>1. Resumo em linguagem simples</H>
          <Li>
            O app guarda seus documentos <B>somente no seu aparelho</B>.
          </Li>
          <Li>
            <B>Não existe conta, login, servidor nem nuvem</B> operada por nós.
            Não temos acesso aos seus documentos.
          </Li>
          <Li>Seus PDFs ficam em uma área privada do app.</Li>
          <Li>
            O app <B>funciona sem internet</B>.
          </Li>
          <Li>
            Nós <B>não vendemos, não compartilhamos e não transmitimos</B> seus
            dados a ninguém.
          </Li>

          <H>2. Quem somos</H>
          <P>
            O maDocs é desenvolvido por Gustavo S. Samadello, CNPJ
            65.250.206/0001-15, contato: contato.madocs@gmail.com.
          </P>
          <P>
            Este texto explica como o app trata dados pessoais, em conformidade
            com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).
          </P>

          <H>3. Como o app funciona</H>
          <P>
            O maDocs é um cofre digital para você reunir documentos em PDF (como
            RG, CNH, CPF e comprovantes) em um só lugar.
          </P>
          <P>
            <B>Importar.</B> Você escolhe um PDF no seu aparelho ou recebe um
            PDF compartilhado por outro app (como WhatsApp ou e-mail). O app
            copia o arquivo para uma pasta privada, acessível apenas por ele.
          </P>
          <P>
            <B>Organizar.</B> Você informa um nome, uma categoria e, se quiser,
            tags, o número do documento e a data de validade. Essas informações
            ficam em um banco de dados local, no próprio aparelho.
          </P>
          <P>
            <B>Consultar.</B> Você busca, filtra, abre, renomeia, move,
            compartilha ou exclui seus documentos quando quiser.
          </P>

          <H>4. Quais dados são tratados</H>
          <Li>
            <B>Arquivos PDF dos documentos:</B> você os importa; ficam na pasta
            privada do app, no seu aparelho.
          </Li>
          <Li>
            <B>Nome, categoria, tags, número e validade:</B> você digita; ficam
            no banco de dados local, no seu aparelho.
          </Li>
          <Li>
            <B>Miniaturas da primeira página:</B> geradas pelo app; ficam na
            pasta privada do app, no seu aparelho.
          </Li>
          <Li>
            <B>Configurações do app:</B> você escolhe; ficam no seu aparelho.
          </Li>
          <P>
            Os documentos podem conter dados pessoais, inclusive dados sensíveis
            (por exemplo, de saúde). Por isso, tratamos tudo com o mesmo
            cuidado: <B>nada disso sai do seu aparelho por iniciativa do app</B>
            .
          </P>
          <P>
            O app <B>não</B> lê o conteúdo dos seus documentos, não faz
            reconhecimento de texto (OCR) e não extrai informações
            automaticamente.
          </P>

          <H>5. Permissões solicitadas</H>
          <Li>
            <B>Arquivos / seletor de documentos:</B> apenas para você escolher
            os PDFs a importar.
          </Li>
          <P>
            Você pode revogar qualquer permissão a qualquer momento nas
            configurações do sistema.
          </P>

          <H>6. Para que usamos os dados e a base legal</H>
          <P>
            Os dados são usados <B>exclusivamente</B> para o app funcionar para
            você: guardar, organizar, buscar e abrir seus documentos.
          </P>
          <P>
            Como os dados permanecem no seu aparelho e não são enviados a nós, o
            desenvolvedor{" "}
            <B>não tem acesso a eles e não realiza tratamento sobre eles</B>.
            Quem decide o que guardar, por quanto tempo e com quem compartilhar
            é você. Nas situações em que o app executa operações a seu pedido
            (como importar, exportar ou compartilhar), a base é a{" "}
            <B>execução do serviço que você solicitou</B> e o seu{" "}
            <B>consentimento</B>, que pode ser retirado a qualquer momento.
          </P>

          <H>7. Compartilhamento</H>
          <P>
            O app <B>não envia</B> seus documentos a terceiros. O
            compartilhamento só acontece quando <B>você</B> o inicia:
          </P>
          <Li>
            ao usar o botão <B>Compartilhar</B> ou <B>Abrir com</B>, o PDF é
            entregue ao app que você escolher (WhatsApp, e-mail, leitor de PDF,
            Drive etc.). A partir daí, o tratamento é regido pela política de
            privacidade desse app, e não por esta.
          </Li>
          <P>
            Recomendamos cuidado ao compartilhar documentos de identificação.
          </P>

          <H>8. Relatórios de erro e métricas</H>
          <P>
            O app <B>não</B> usa publicidade nem rastreadores de comportamento.
            Se ativarmos relatórios de falhas (como o Sentry), eles serão
            configurados para <B>não incluir dados pessoais</B>, como nomes de
            arquivos, números de documentos ou o conteúdo dos PDFs. Esses
            relatórios servem apenas para corrigirmos defeitos técnicos.
          </P>

          <H>9. Segurança</H>
          <Li>
            Os PDFs são salvos em área privada, inacessível a outros
            aplicativos.
          </Li>
          <P>
            Nenhum sistema é totalmente imune a riscos. Mantenha o sistema do
            seu aparelho atualizado e use bloqueio de tela.
          </P>

          <H>10. Backups do sistema operacional</H>
          <P>
            O iOS e o Android podem incluir dados de apps em backups automáticos
            (iCloud, Google). [DESCREVA AQUI A DECISÃO TOMADA: se a pasta dos
            documentos é ou não incluída nesses backups.]
          </P>

          <H>11. Por quanto tempo guardamos os dados</H>
          <P>
            Seus dados ficam no aparelho <B>até você excluí-los</B>. Você pode:
          </P>
          <Li>excluir um documento individualmente;</Li>
          <Li>
            usar a opção <B>Apagar tudo</B>, nas configurações, que remove
            registros, PDFs e miniaturas;
          </Li>
          <Li>desinstalar o app, o que remove os dados armazenados nele.</Li>
          <P>
            Cópias que você compartilhou <B>não são apagadas</B> por essas
            ações, pois estão fora do app.
          </P>

          <H>12. Seus direitos como titular (LGPD, art. 18)</H>
          <P>Você tem direito a:</P>
          <Li>confirmação de que há tratamento;</Li>
          <Li>acesso aos dados;</Li>
          <Li>correção de dados incompletos ou desatualizados;</Li>
          <Li>anonimização, bloqueio ou eliminação;</Li>
          <Li>portabilidade;</Li>
          <Li>informação sobre compartilhamento;</Li>
          <Li>revogação do consentimento.</Li>
          <P>
            Como todos os dados estão no seu aparelho,{" "}
            <B>você exerce esses direitos diretamente no app</B>: consulta e
            edita seus documentos, compartilha os arquivos (portabilidade) e
            apaga o que quiser (eliminação). Se tiver qualquer dúvida, escreva
            para contato.madocs@gmail.com.
          </P>
          <P>
            Você também pode contatar a Autoridade Nacional de Proteção de Dados
            (ANPD): gov.br/anpd.
          </P>

          <H>13. Crianças e adolescentes</H>
          <P>
            O app não é direcionado a menores de 18 anos. Se um responsável
            guardar documentos de um menor, a responsabilidade pelo cuidado
            desses dados é dele.
          </P>

          <H>14. Transferência internacional</H>
          <P>
            O app não envia seus dados para fora do aparelho. Não há
            transferência internacional realizada por nós. Se você compartilhar
            um documento com um serviço de terceiros, esse serviço pode tratar
            os dados em outros países, conforme a política dele.
          </P>

          <H>15. Mudanças futuras</H>
          <P>
            Versões futuras poderão oferecer{" "}
            <B>sincronização opcional com o Google Drive</B>. Nesse caso, esta
            política será atualizada <B>antes</B> do lançamento, e a
            sincronização só será ativada com o seu{" "}
            <B>consentimento expresso</B>. O modo 100% local continuará
            disponível.
          </P>
          <P>
            Alterações relevantes serão informadas no app, e a data de
            atualização no topo deste texto será revista.
          </P>

          <H>16. Contato</H>
          <P>
            <B>Responsável:</B> Gustavo S. Samadello
          </P>
          <P>
            <B>E-mail:</B> contato.madocs@gmail.com
          </P>
        </View>
      </ScrollView>
    </SecondaryView>
  );
}
