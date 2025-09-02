import { useState } from "react";
import { Button } from "@justfixnyc/component-library";

import { Header } from "../../Header/Header";
import { LetterBuilderForm } from "../../LetterBuilder/LetterBuilderForm";
import { useSendGceLetterData } from "../../../api/hooks";
import { GCELetter, GCELetterPostData } from "../../../types/APIDataTypes";
import {
  base64ToBlob,
  buildLetterHtml,
} from "../../LetterBuilder/LetterContent";
import "./LetterSender.scss";

export const LetterSender: React.FC = () => {
  const { trigger } = useSendGceLetterData();

  const [letterResp, setLetterResp] = useState<GCELetter>();

  const letterProps: Omit<GCELetterPostData, "html_content"> = {
    user_details: {
      first_name: "Maxwell",
      last_name: "Austensen",
      phone_number: "3475551234",
      email: "maxwell@justfix.org",
      bbl: "3000010001",
      primary_line: "deliverable",
      secondary_line: "Apt 1",
      city: "BROOKLYN",
      state: "NY",
      zip_code: "11111",
    },
    landlord_details: {
      name: "Maxwell Austensen",
      email: "maxwell@justfix.org",
      primary_line: "deliverable",
      secondary_line: "Apt 1",
      city: "BROOKLYN",
      state: "NY",
      zip_code: "11111",
    },
    mail_choice: "WE_WILL_MAIL",
    email_to_landlord: true,
  };
  const letterPreview = buildLetterHtml(letterProps, false);
  const letterHtml = buildLetterHtml(letterProps, true);
  const letterPostData = { ...letterProps, html_content: letterHtml };

  return (
    <div id="letter-sender-page">
      <Header
        title="Send a free letter asserting your rights under Good Cause"
        showProgressBar={false}
        isGuide
      />

      <div className="content-section">
        <div className="content-section__content">
          <LetterBuilderForm />
          <h3>Test Tenants2 GCE Letter API</h3>
          Letter Data
          <pre>{JSON.stringify(letterProps, null, 2)}</pre>
          <br />
          Letter Preview
          <iframe
            title="letter preview"
            srcDoc={letterPreview}
            width="600"
            height="600"
          />
          <Button
            labelText="submit letter"
            onClick={async () => {
              const resp = await trigger(letterPostData);
              setLetterResp(resp);
              const pdfBlob = base64ToBlob(resp.pdf_content, "application/pdf");
              const fileURL = URL.createObjectURL(pdfBlob);
              window.open(fileURL);
            }}
          />
          <pre>{JSON.stringify(letterResp, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
