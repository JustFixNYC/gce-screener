import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRollbar } from "@rollbar/react";
import { Button, Icon } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { FormFields } from "../Form/Survey";
import { useSendGceData } from "../../../api/hooks";
import { GCEPostData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import { ProgressStep } from "../../../helpers";
import { JFCLLink, JFCLLinkExternal, JFCLLinkInternal } from "../../JFCLLink";
import { cleanAddressFields } from "../../../api/helpers";
import { gtmPush } from "../../../google-tag-manager";
import "./Home.scss";

export type Address = {
  bbl: string;
  address: string;
  houseNumber: string;
  streetName: string;
  borough: string;
  zipcode?: string;
  longLat: string;
};

export const Home: React.FC = () => {
  const { i18n, _ } = useLingui();
  const navigate = useNavigate();
  const [sessionUser, setUser] = useSessionStorage<GCEUser>("user");
  const [, setAddress, removeAddress] = useSessionStorage<Address>("address");
  const [, , removeFormFields] = useSessionStorage<FormFields>("fields");
  const [lastStepReached, setLastStepReached] =
    useSessionStorage<ProgressStep>("lastStepReached");
  const [geoAddress, setGeoAddress] = useState<Address>();
  const [inputInvalid, setInputInvalid] = useState(false);
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();

  useEffect(() => {
    removeAddress();
    removeFormFields();
    setLastStepReached(ProgressStep.Home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!geoAddress) {
      setInputInvalid(true);
      return;
    }
    setAddress(geoAddress);
    const postData: GCEPostData = {
      id: sessionUser?.id,
      ...cleanAddressFields(geoAddress),
    };

    try {
      const userResp = (await trigger(postData)) as GCEUser;
      if (!sessionUser?.id) setUser(userResp);
    } catch {
      rollbar.critical("Cannot connect to tenant platform");
    }

    removeFormFields();
    setLastStepReached(ProgressStep.Address);
    navigate(`/${i18n.locale}/confirm_address`);
  };

  return (
    <div id="home-page">
      <Header
        title={
          <Trans>
            Learn if you’re covered <br aria-hidden />
            by Good Cause <br aria-hidden />
            Eviction law in NYC
          </Trans>
        }
        lastStepReached={lastStepReached}
      >
        <form className="geo-search-form" onSubmit={handleAddressSearch}>
          <GeoSearchInput
            //initialAddress={address}
            onChange={setGeoAddress}
            invalid={inputInvalid}
            invalidText={_(msg`You must enter an address`)}
            setInvalid={setInputInvalid}
            hideInvalidOnFocus
            placeholder={
              <>
                <Icon icon="locationDot" />
                <Trans>Enter your address</Trans>
              </>
            }
          />
          <Button type="submit" labelText={_(msg`Get started`)} />
        </form>
      </Header>

      <div className="content-section home__about-law">
        <div className="content-section__content">
          <section className="about-law">
            <h3>
              <Trans>About the law</Trans>
            </h3>
            <p>
              <Trans>
                <span className="good-cause-text-group">
                  Good Cause Eviction
                </span>{" "}
                protections went into effect on April 20th, 2024. If you are
                covered by the law, you have strong legal protections against
                eviction as long as you follow your lease. There are also limits
                to how much your landlord can raise your rent.{" "}
              </Trans>
              <JFCLLink
                to={`${i18n.locale}/rent_calculator`}
                onClick={() =>
                  gtmPush("gce_rent_calculator", { from: "home-page" })
                }
              >
                <Trans>Calculate your max rent increase.</Trans>
              </JFCLLink>
            </p>
            <p>
              <Trans>
                To be covered by the law, your apartment must meet several
                requirements.{" "}
              </Trans>
              <JFCLLinkExternal to="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page">
                <Trans>Learn more about the law.</Trans>
              </JFCLLinkExternal>{" "}
              <Trans>
                If you live in New York City, you can use this site to learn
                which requirements you meet and how to assert your rights.
              </Trans>
            </p>
          </section>
          <section className="callout-box">
            <h4 className="callout-box__header">
              <Trans>
                If you’re covered by{" "}
                <span className="good-cause-text-group">Good Cause</span>
              </Trans>
            </h4>
            <p>
              <Trans>
                You have a legal right to limited rent increases and the right
                to stay in your home. If your landlord is either planning to
                raise your rent, or not offering you a new lease, we will draft
                a USPS Certified Mail® letter asserting your{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                rights. We will even send it for you, for free.
              </Trans>
            </p>
            <JFCLLinkInternal to={`/${i18n.locale}/letter`}>
              <Trans>Learn more about the Letter Sender</Trans>
            </JFCLLinkInternal>
          </section>
          <section className="callout-box">
            <h4 className="callout-box__header">
              <Trans>
                If you’re not covered by{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                Eviction
              </Trans>
            </h4>
            <p>
              <Trans>
                If you live in NYC and are not covered by{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                Eviction, you still have important tenant protections. Depending
                on the type of housing you live in, your protections may be even
                stronger than those provided by{" "}
                <span className="good-cause-text-group">Good Cause</span>.
              </Trans>
            </p>
            <JFCLLinkInternal to={`/${i18n.locale}/tenant_rights`}>
              <Trans>Learn more about tenant protections in NYC</Trans>
            </JFCLLinkInternal>
          </section>
          <section className="callout-box">
            <h4 className="callout-box__header">
              <Trans>If you live outside of NYC</Trans>
            </h4>
            <p>
              <Trans>
                Tenants and tenant advocates are working to extend{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                protections throughout New York State.
              </Trans>
            </p>
            <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause/">
              <Trans>
                Learn where{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                protections have been won
              </Trans>
            </JFCLLinkExternal>
          </section>
        </div>
      </div>
      <div className="content-section home__about-project">
        <div className="content-section__content">
          <section className="about-project">
            <h3>
              <Trans>About this site</Trans>
            </h3>
            <p>
              <Trans>
                <span className="good-cause-text-group">Good Cause</span> law
                can be complex to understand and to use to protect yourself.
                This site exists to make it easier for you and your neighbors to
                understand your tenant protections and to assert your rights.
              </Trans>
            </p>
            <p>
              <Trans>
                This site is a collaboration between the Housing Justice for All
                Coalition and JustFix. We thank all individuals who contributed
                to this site and to all the tenants and advocates who fight for{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                protections.
              </Trans>
            </p>
          </section>
          <div className="about-project__orgs-container">
            <section className="callout-box">
              <h4 className="callout-box__header">
                <Trans>Housing Justice for All</Trans>
              </h4>
              <p>
                <Trans>
                  A statewide coalition of tenants and homeless New Yorkers
                  united in our fight for housing as a human right.
                </Trans>
              </p>
              <JFCLLinkExternal to="https://housingjusticeforall.org/">
                <Trans>Visit Housing Justice for All</Trans>
              </JFCLLinkExternal>
            </section>
            <section className="callout-box">
              <h4 className="callout-box__header">
                <Trans>JustFix</Trans>
              </h4>
              <p>
                <Trans>
                  A nonprofit organization that builds online tools to help New
                  Yorkers achieve affordable, healthy, eviction-free housing.
                </Trans>
              </p>
              <JFCLLinkExternal to="https://www.justfix.org/">
                <Trans>Visit JustFix</Trans>
              </JFCLLinkExternal>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
