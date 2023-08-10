import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getEnv } from "../env.server";
import styles from "./styles/app.css"

export const meta = () => ({
  charset: "utf-8",
  title: "Journeys with Kris",
  viewport: "width=device-width,initial-scale=1",
  meta: [
    {
      property: "og:title",
      content: "Journeys with Kris",
    },
    {
      property: "og:description",
      content: "Journeys with Kris - travel content and information to help you travel the world while maintaining your job.",
    },
    {
      property: "og:image",
      content: "url(/kris-og.jpg)", 
    },
  ],
});


export function loader() {
  return json({
    ENV: getEnv()
  })
}

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

/* 
  cupcake 
  dracula
  halloween
*/

export default function App() {
  const data = useLoaderData()
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>

      <body className="h-full">
        <Outlet />
        <ScrollRestoration />

        <Scripts />
        <script dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`
        }} />

        <LiveReload />
      </body>
    </html>
  );
}