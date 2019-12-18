import React from 'react'
import '../additional.css';
import ethereum from '../Images/ethereum3.png';
import { Header, Divider, Grid, Image, List, Segment, Container, Breadcrumb } from 'semantic-ui-react'
import Footer2 from '../Footer2'


const Screen = () => (
  <Segment vertical style={{ backgroundColor: 'white', border: 'none', paddingBottom: '0px' }}>

    <Container id='disclaimer-container' style={{ paddingTop: '2rem', paddingBottom: '5em' }}>

    <a id='a-footer' href='/'>
      <Breadcrumb.Divider  style={{ fontSize: '18px' }} icon='left arrow' />
    </a>

      <Header as='h3' id='disclaimer-header' style={{ textAlign: 'center', lineHeight: '1.6em', fontSize: '2.7em', color: 'black', marginBottom: '0.5em' }}>
        Decentraland Games Disclaimer
      </Header>

      <p style={{ fontSize: '1.33em' }}>
        If you believe any content to be in violation of the Digital Millennium Copyright Act (”DMCA”), please seek the removal of the aforementioned infringing material by contacting us at hello@decentral.games.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        Warranty
      </p>

      <p style={{ fontSize: '1.33em' }}>
        1. Decentral Games will provide services with diligence and care in accordance with Decentral Games rules. However, Decentral Games cannot guarantee that services will:
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a) be compatible with any specific hardware or software a customer uses;
        <br></br>
        (b) be available without interruption either planned or unplanned;
        <br></br>
        (c) be defect free, or possess any type of computer virus or malware, or free of issues deriving from hardware malfunctions;
        <br></br>
        (d) meet the user’s expectations and requirements.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        User compliance with law
      </p>

      <p style={{ fontSize: '1.33em' }}>
        2. The user must adhere to the laws applicable in the jurisdiction where they are resident, domiciled, and/or located. Decentral Games are in no way responsible for providing any advice to users regarding tax and any other legal matters. 
      </p>

      <p style={{ fontSize: '1.33em' }}>
        If a user wants to get advice on tax and legal matters, they will be advised to contact the authorities in their jurisdiction.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        Non-reliance
      </p>

      <p style={{ fontSize: '1.33em' }}>
        3. Information available from  the services is only for general information purposes and not intended to meet a user’s requirements. Any commentary, tips and materials posted through the services by Decentral Games or a third party are not intended to amount to recommendation, advice or endorsement on which reliance should be placed.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        No liability for inaccuracies or incompleteness
      </p>

      <p style={{ fontSize: '1.33em' }}>
        4. The User acknowledges, understands and agrees that Decentral Games cannot guarantee that their products, services and website will  always be accurate and current.   If the user detects or is aware of any errors or incompleteness, they shall:
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a) not take any advantage whatsoever thereof;
        <br></br>
        (b) not disclose confidential information or any error or incompleteness;
        <br></br>
        (c) if Decentral Games detect or become aware of any error or incompleteness, they will notify Decentral Games by emailing  hello@decentral.games.
      </p>

      <p style={{ fontSize: '1.33em' }}>
        5. Decentral Games accepts no liability for any crypto transactions, or the sending or receiving of Fiat currency through any 3rd party system. 
      </p>

      <p style={{ fontSize: '1.33em' }}>
        6. Decentral Games will not acknowledge or accept any liability for damage and/or losses to an Ethereum Wallet owner, or a Decentral Games Account Holder and/or a third party caused directly and/or indirectly due to the Ethereum Wallet owner / Decentral Games Account Holder:
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a) making deposits to his Decentral Games Account from any Ethereum wallet;
        <br></br>
        (b) requesting Decentral Games send funds from their Decentral Games wallet and/or balance of account to any other wallet;
        <br></br>
        (c) providing the wrong details of any personal wallet, personal account for the purpose of withdrawals from his/her Decentral Games wallet and/or balance of account;
        <br></br>
        (d) allowing any other person or system to access his or her Decentral Games Account for the purpose of sending or receiving any funds from his or her  Decentral Games wallet and/or balance of Account.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        No liability for actions of users
      </p>

      <p style={{ fontSize: '1.33em' }}>
        7. The user acknowledges and agrees that Decentral Games is not liable in any way permitted by law for any derogatory, defamatory, offensive or illegal behaviour or conduct of any other customer, wallet owner, account holder or user of the Services or Website provided by Decentral Games.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        No liability for any software or hardware failures
      </p>

      <p style={{ fontSize: '1.33em' }}>
        8. Decentral Games will not be held to account and will not be deemed responsible for any interruptions due to a failure of third party telecommunications or any other data transmission system or any computer system (including without limitation all Decentraland Games products), where by the User is prevented from continuing to use the services after he or she has placed a bet/wager or started a game. 
      </p>

      <p style={{ fontSize: '1.33em' }}>
        Without guaranteeing resolution,  Decentral Games will take steps to ensure that its computer systems enable users to resume the User’s participation in the Game or Services. If this is not so then Decentral Games will:
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a) ensure that any and all games are terminated; 
        <br></br>
        (b)  refund the amount of any bet or wager to the registered or relevant Ethereum wallet address.
      </p>

      <p style={{ fontSize: '1.33em' }}>
        9. Where the User’s participation in the Services is interrupted by a failure on all or part of Decentral Games's systems, hardware or software, Decentral Games shall: 
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a)  refund the amount currently wagered in the Service, and if the wallet owner, or Decentral Games account holder has accrued funds at the time of the failure, credit the monetary value of the fund to the Account Holder’s Ethereum wallet address or Decentral Games Account Or if the user no longer has access to their Ethereum wallet address, or that their Decentral Games account  no longer exists, by paying it to the Wallet owner, or Account holder, in the form of the currency that supplied the account in the first instance;
        <br></br>
        (b) inform Vegas City Limited of the incident. WIth a description of the occurrence along with details of any  financial losses incurred by the user;
        <br></br>
        (c) pause any operations or functions where further users are likely to be affected by the same failure.
      </p>

     <p style={{ fontSize: '1.33em' }}>
        10. Except as set out above, Decentral Games do not accept any liability for delays, losses or damage suffered or incurred by an Ethereum wallet owner or a Decentral Games account holder and/or any third party caused directly and/or indirectly due to: 
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a) any failure of Decentral Games’s software or hardware solutions except where such failure arise from Decentral Games’s failure to provide products and services with a reasonable level of care and skill;         
        <br></br>
        (b) any failure of the device used by the user to access Decentral Games produces and services; 
        <br></br>
        (c) any failure arising in Decentral  Games products and services which arise from incompatibility of the computer or device used by the user; 
        <br></br>
        (d) any failure of any 3rd party telecommunications or any other system that sends or received data;  
        <br></br>
        (e) any problem or failure of the internet; 
        <br></br>
        (f) any virus attack, hack, malware or malicious act that can be traced to the Decentral Games systems, except where such failure arises from Decentral Games’s negligence or failure to supply the games and services with an industry accepted level of care and skill.
      </p>

      <p style={{ fontSize: '1.33em' }}>
        11. Games and services provided by Decentral Games may include 3rd party content and links to external content not under control or management by Decentral Games.
      </p>

      <p style={{ fontSize: '1.33em' }}>
        12. Decentral Games gives no warranties and accepts no responsibility for any third party content.
      </p>

      <p style={{ fontSize: '1.33em' }}>
        13. Links to external websites and services are not endorsements. The User agrees that Decentral Games are not responsible for the content or availability of any such websites or services. Decentral Games recommends users read the terms and conditions, privacy policies and disclaimers of those entities to ensure they accept them.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        Gaming disclaimer
      </p>

      <p style={{ fontSize: '1.33em' }}>
        14. The user accepts that any similarity of names, circumstances or conditions used, depicted, described or suggested in the games operated is entirely unintended and coincidental.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        General exclusion of liability
      </p>

      <p style={{ fontSize: '1.33em' }}>
        15. Decentral Games does not acknowledge or accept liability for losses to an Ethereum wallet holder, an Account Holder and/or a third party caused directly and/or indirectly due to any:
      </p>

      <p style={{ fontSize: '1.33em' }}>
        (a) mistake, misinterpretation, mishearing, misreading, mistranslation, spelling mistake, fault in reading, transaction error, technical failure of any kind, user registration error, cancellation of a game for any reason;        
        <br></br>
        (b) any unforeseeable circumstances that prevent Decentral Games from fulfilling their obligations;
        <br></br>
        (c) violation of the Decentral Games Rules by an Ethereum Wallet owner, Decentral Games  Account Holder or third party; 
        <br></br>
        (d) collusion by the Account Holder or third party;  
        <br></br>
        (e) criminal actions by the Account Holder or third party;
        <br></br>
        (f) advice or recommendations provided by Decentral Games via the games, applications or website;
        <br></br>
        (g) advice from any  third party via the games, applications or website; 
        <br></br>
        (h) any market fluctuations, including variances in exchange rates.
      </p>

      <p style={{ fontSize: '1.33em', marginTop: '1.33em', fontWeight: 'bold' }}>
        Limitation of liability
      </p>

      <p style={{ fontSize: '1.33em' }}>
        16. Decentral Games’s total liability to an Ethereum Wallet owner, or Decentral Games Account Holder in respect of all losses coming under or in connection with any bet placed by the  Ethereum Wallet owner, or Decentral Games Account Holder shall in no circumstances exceed the amount of the relevant bet placed by the Ethereum Wallet owner, or Decentral Games Account Holder that caused the claim.
      </p>

      <p style={{ fontSize: '1.33em' }}>
        17. Nothing in these terms will limit or exclude Decentral Games’s liability for any liability where it would be unlawful for Decentral Games to block or hold back liability.
      </p>
      
      <p style={{ fontSize: '1.33em' }}>
        18. The user acknowledges and accepts that Metaverse Holdings Ltd. (the “Curator”), the curator of Decentraland is not, and shall not be liable for the services provided by Decentral Games and hereby waives and releases the Curator from and against any claim in connection with its use of the services of Decentral Games.
      </p>

    </Container>
  </Segment>
)

export default Screen
