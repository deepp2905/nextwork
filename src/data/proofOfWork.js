export const proofOfWork = {
  eyebrow: 'Proof of Work',
  title: 'Building a Static Website on AWS S3',
  author: 'Deep Patel',
  completedOn: 'May 10, 2026',
  sections: [
    {
      key: 'overview',
      number: '01',
      title: 'Overview',
      body: 'In this project I deployed a fully static portfolio site to Amazon S3, fronted it with CloudFront for global low-latency delivery, and secured custom domain traffic with an ACM TLS certificate. The goal was to ship a production-grade hosting setup without managing a single server, while keeping monthly cost well under a dollar at low traffic.',
      imageLabel: 'Architecture overview banner',
    },
    {
      key: 'architecture',
      number: '02',
      title: 'Architecture',
      body: 'Requests resolve through Route 53 to a CloudFront distribution. CloudFront pulls content from a private S3 origin via an Origin Access Control, so the bucket itself is never publicly exposed. Cache behaviors split static assets (long TTL, fingerprinted) from HTML (short TTL) so deploys propagate quickly without sacrificing edge performance.',
      imageLabel: 'CloudFront + S3 + Route 53 diagram',
    },
    {
      key: 'steps',
      number: '03',
      title: 'Steps',
      body: 'I created the S3 bucket with public access fully blocked, uploaded the built site with content-type metadata set per file extension, requested an ACM certificate in us-east-1 so CloudFront could consume it, then wired up the distribution with the OAC and an alternate domain name. Finally I pointed Route 53 alias records at the distribution and ran a smoke test from three regions.',
      imageLabel: 'AWS Console deployment screenshot',
    },
    {
      key: 'challenges',
      number: '04',
      title: 'Challenges',
      body: 'The trickiest part was getting the Origin Access Control bucket policy right — older tutorials still reference the deprecated OAI pattern, so the policy snippets I copied first did not match the new principal format. I also got bitten by certificate region: ACM certs must be in us-east-1 for CloudFront, regardless of where the rest of your stack lives.',
      imageLabel: 'Bucket policy + OAC configuration',
    },
    {
      key: 'learnings',
      number: '05',
      title: 'Learnings',
      body: 'Static hosting on AWS is dramatically cheaper and simpler than running EC2 or a container, but the moving parts are subtle: caching, certificate region, origin access, and DNS all have to line up. I now have a reusable mental model for serverless web delivery, and I am much more comfortable reading AWS IAM policies and CloudFront cache behavior config.',
      imageLabel: 'Final deployed site preview',
    },
  ],
};
