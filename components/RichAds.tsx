/**
 * RichAds Component
 * Loads the RichAds pop-up and overlay scripts
 * To disable: remove this component import and usage from layout.tsx
 */
export default function RichAds() {
  return (
    <script
      src="https://richinfo.co/richpartners/pops/js/richads-pu-ob.js"
      data-pubid="1011234"
      data-siteid="396583"
      async
      data-cfasync="false"
    />
  );
}
