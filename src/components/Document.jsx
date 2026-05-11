import Checklist from './Checklist.jsx';
import Quiz from './Quiz.jsx';
import Quote from './doc/Quote.jsx';
import CodeBlock from './doc/CodeBlock.jsx';
import './Document.css';

function ImagePlaceholder({ caption, ratio = '16 / 9' }) {
  return (
    <figure className="doc-image">
      <div className="doc-image__frame" style={{ aspectRatio: ratio }}>
        <span className="doc-image__hint type-small-body-14 type-eyebrow">Image</span>
      </div>
      {caption && (
        <figcaption className="doc-image__caption type-small-body-14">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Step({ index, title, children }) {
  return (
    <section className="doc-step">
      <div className="doc-step__header">
        <span className="doc-step__index type-subheading type-eyebrow" data-highlightable>
          Step {String(index).padStart(2, '0')}
        </span>
        <h2 className="doc-step__title type-h1-24" data-highlightable>{title}</h2>
      </div>
      <div className="doc-step__body">{children}</div>
    </section>
  );
}

export default function Document() {
  return (
    <article className="doc">
      <ImagePlaceholder ratio="3 / 1" />

      <header className="doc__header">
        <span className="doc__eyebrow type-subheading type-eyebrow" data-highlightable>Tutorial · 25 min</span>
        <h1 className="doc__title type-h1" data-highlightable>Deploy a Web App on AWS</h1>
        <p className="doc__lede type-large-body" data-highlightable>
          A step-by-step guide to taking a React app from your laptop to a live
          URL on AWS Amplify — with checkpoints along the way to make sure
          nothing gets skipped.
        </p>
      </header>

      <section className="doc__overview">
        <h2 className="type-h2" data-highlightable>What you&rsquo;ll do</h2>
        <Checklist
          variant="white-smoke"
          items={[
            'Create an AWS account and set up billing alerts',
            'Push your React project to a Git repository',
            'Connect Amplify Hosting to your repo',
            'Configure a custom domain',
            'Verify the deployment is healthy',
          ]}
        />
      </section>

      <Step index={1} title="Set up your AWS account">
        <p className="type-body" data-highlightable>
          Head to <em>aws.amazon.com</em> and create a new account. You&rsquo;ll
          need a credit card on file, but everything in this tutorial fits
          comfortably inside the Free Tier. Once your account is active, enable
          billing alerts so a runaway service can&rsquo;t surprise you.
        </p>
        <Quote title="Why billing alerts matter">
          AWS bills usage by the hour, and a misconfigured service can rack up
          charges quietly. A $5 alert is a five-minute setup that pays for
          itself the first time something runs longer than expected.
        </Quote>
        <ImagePlaceholder caption="The AWS console after first sign-in." />
        <h3 className="doc-step__sub type-subheading type-eyebrow" data-highlightable>Before you move on</h3>
        <Checklist
          items={[
            'Account is created and verified',
            'MFA enabled on the root user',
            'Billing alert configured at a comfortable threshold',
          ]}
        />
      </Step>

      <Step index={2} title="Push your project to Git">
        <p className="type-body" data-highlightable>
          Amplify deploys directly from a Git provider, so your code needs to
          live in GitHub, GitLab, or Bitbucket. If you already have a repo, you
          can skip ahead — otherwise, initialize one and push your first
          commit.
        </p>
        <CodeBlock language="bash">{`git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:you/your-app.git
git push -u origin main`}</CodeBlock>
        <p className="type-body" data-highlightable>
          Make sure your <code>.gitignore</code> excludes build artifacts so you
          don&rsquo;t bloat the repo:
        </p>
        <CodeBlock language="gitignore">{`node_modules
dist
.env
.DS_Store`}</CodeBlock>
        <ImagePlaceholder caption="Initial commit on GitHub." />
        <Checklist
          items={[
            'Repository created on GitHub / GitLab / Bitbucket',
            'Local project pushed to the main branch',
            '.gitignore excludes node_modules and build artifacts',
          ]}
        />
      </Step>

      <Quiz />

      <Step index={3} title="Connect Amplify Hosting">
        <p className="type-body" data-highlightable>
          In the AWS console, open <em>Amplify Hosting</em> and choose
          &ldquo;Host your web app&rdquo;. Authorize your Git provider, pick the
          repository and branch, and let Amplify auto-detect your build
          settings. The default for Vite-based React apps usually just works.
        </p>
        <p className="type-body" data-highlightable>
          If Amplify can&rsquo;t infer your build, drop in an{' '}
          <code>amplify.yml</code> at the project root:
        </p>
        <CodeBlock language="yaml">{`version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'`}</CodeBlock>
        <ImagePlaceholder caption="Amplify auto-detected build configuration." />
        <Checklist
          items={[
            'Git provider authorized',
            'Correct repo and branch selected',
            'Build settings reviewed',
            'First deployment succeeded',
          ]}
        />
      </Step>

      <Step index={4} title="Add a custom domain">
        <p className="type-body" data-highlightable>
          The default <code>amplifyapp.com</code> URL works, but most projects
          want their own domain. From the <em>Domain management</em> tab, point
          your DNS at the provided records — Amplify handles SSL automatically
          once propagation finishes.
        </p>
        <Quote title="DNS takes time">
          Propagation can take anywhere from a few minutes to 24 hours. If your
          domain still isn&rsquo;t resolving after a few hours, double-check
          the CNAME records at your registrar before assuming something&rsquo;s
          broken.
        </Quote>
        <ImagePlaceholder caption="Domain status moving from pending to active." />
        <Checklist
          items={[
            'Domain added in Amplify',
            'DNS records updated at your registrar',
            'HTTPS certificate issued',
          ]}
        />
      </Step>

      <Step index={5} title="Verify and monitor">
        <p className="type-body" data-highlightable>
          Open your live URL and click through the golden path. Then set up a
          basic CloudWatch alarm so you&rsquo;ll know if traffic disappears or
          error rates spike. You&rsquo;re done — every push to your main branch
          will now redeploy automatically.
        </p>
        <Checklist
          items={[
            'Production URL loads correctly',
            'Core flows tested in the live environment',
            'Basic monitoring alarm in place',
          ]}
        />
      </Step>

      <footer className="doc__footer">
        <h2 className="type-h1-24" data-highlightable>Nice work.</h2>
        <p className="type-body" data-highlightable>
          Your app is live and wired up to redeploy on every push. Open the Ask
          panel any time you&rsquo;d like to dig deeper into a specific step.
        </p>
      </footer>
      
    </article>
  );
}
