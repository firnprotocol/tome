import {
  DOCS_URL,
  DISCORD_URL,
  TELEGRAM_URL,
  TWITTER_URL,
  GITHUB_URL,
  REDDIT_URL,
  EMAIL_URL,
  MEDIUM_URL,
  GITBOOK_URL,
} from "utils/urls";


import GitHubIcon from "@icons/GitHubIcon";
import TwitterIcon from "@icons/TwitterIcon";
import RedditIcon from "@icons/RedditIcon";
import DiscordIcon from "@icons/DiscordIcon";
import TelegramIcon from "@icons/TelegramIcon";
import MediumIcon from "@icons/MediumIcon";
import GitBookIcon from "@icons/GitBookIcon";
import EmailIcon from "@icons/EmailIcon";
import DocsIcon from "@icons/DocsIcon";
import FIRN_LOGO from "assets/firn.svg";


export function PageFooter() {
  return (
    <footer>
      <div className="mx-auto pb-6 sm:max-w-3xl pt-6 px-8 lg:max-w-7xl">
        <div className="space-y-8 text-center">
          <div className="flex space-x-4 sm:space-x-6 place-content-end lg:place-content-center">
            <FooterSocialSection/>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-4 opacity-20">
        </div>
        <p className="text-base text-zinc-400 text-center font-telegrama">
          <span className="opacity-50">
            FREEDOM
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 active:from-cyan-700 active:to-blue-700">
            <img src={FIRN_LOGO} className="ml-4 mr-4 h-5 w-auto inline -mt-1.5"/>
          </span>
          <span className="opacity-50">
             FIRN
          </span>
        </p>
      </div>
    </footer>
  );
}


function FooterSocialSection() {
  return (
    <>
      <FooterSocialLink
        href={TWITTER_URL}
        IconComponent={TwitterIcon}
        className="text-blue-400 hover:text-blue-400"
      />
      <FooterSocialLink
        href={DISCORD_URL}
        IconComponent={DiscordIcon}
        className="text-indigo-500 hover:text-indigo-500"
      />
      {/*<FooterSocialLink*/}
      {/*  href={TELEGRAM_URL}*/}
      {/*  IconComponent={TelegramIcon}*/}
      {/*  className="group-hover:text-sky-400 dark:text-sky-400"*/}
      {/*/>*/}
      <FooterSocialLink
        href={EMAIL_URL}
        IconComponent={EmailIcon}
      />
      {/*<FooterSocialLink*/}
      {/*  href={MEDIUM_URL}*/}
      {/*  IconComponent={MediumIcon}*/}
      {/*/>*/}
      <FooterSocialLink
        href={DOCS_URL}
        IconComponent={DocsIcon}
        className="text-blue-700 hover:text-blue-700"
      />
      <FooterSocialLink
        href={GITBOOK_URL}
        IconComponent={GitBookIcon}
      />
      <FooterSocialLink
        href={GITHUB_URL}
        IconComponent={GitHubIcon}
        className="text-zinc-100 hover:text-zinc-100"
      />
      <FooterSocialLink
        href={REDDIT_URL}
        IconComponent={RedditIcon}
      />
    </>
  );
}

function FooterSocialLink({ href, IconComponent, className }) {
  return (
    <a href={href} target="_blank">
      <IconComponent className={`h-6 w-6 opacity-50 hover:opacity-90 transition ${className}`}/>
    </a>
  );
}
