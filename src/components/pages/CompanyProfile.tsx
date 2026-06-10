import { PageWrap } from "@/components/pages/ChatHistory";
import { Briefcase, Globe2, Users, Megaphone, Search, Bot, FileText } from "lucide-react";

const services = [
  { icon: Megaphone, title: "Digital Marketing", desc: "Full-funnel marketing for visa & recruitment brands." },
  { icon: FileText, title: "Visa Consultancy Content", desc: "Landing pages, guides, country-specific copy." },
  { icon: Users, title: "Worker Recruitment Marketing", desc: "Lead-gen campaigns for overseas hiring." },
  { icon: Search, title: "SEO", desc: "Technical SEO, content strategy, local visibility." },
  { icon: Globe2, title: "Paid Ads", desc: "Meta, Google, TikTok performance campaigns." },
  { icon: Bot, title: "Automation", desc: "Workflow automation & CRM integrations." },
  { icon: Briefcase, title: "Document Generation", desc: "Templated proposals, contracts and offers." },
];

export const CompanyProfile = () => (
  <PageWrap title="Company Profile" subtitle="VisaHOBe Digital Marketing Agency">
    <div className="gradient-border mb-6 rounded-2xl p-[1px]">
      <div className="rounded-2xl bg-card p-6">
        <h2 className="font-display text-xl font-semibold">VisaHOBe Digital Marketing Agency</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A specialized agency helping visa consultancies and overseas recruitment firms scale through digital marketing,
          content, SEO, paid media and automation.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <div key={s.title} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <s.icon className="h-5 w-5" />
          </div>
          <div className="mt-3 font-display font-semibold">{s.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{s.desc}</div>
        </div>
      ))}
    </div>
  </PageWrap>
);
