import "./globals.css";
import SiteNavbar from "@/components/navigation/site-navbar";
export const metadata = { title: "21st.dev Animation Showcase", description: "Interactive animation component gallery" };
export default function RootLayout({ children }) { return <html lang="en"><body><SiteNavbar /><main>{children}</main></body></html>; }




// //using Anime Navebar 21st dev component
// import "./globals.css"
// import SiteNavbar from "@/components/navigation/site-navbar"

// export const metadata = {
//   title: "Animation Components",
//   description: "Collection of interactive animation components",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <SiteNavbar />

//         {children}
//       </body>
//     </html>
//   )
// }