import { Satellite, Scan, GitBranch, BarChart3, Zap, Route, Brain, ArrowRight, Eye, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';

const pipelineSteps = [
  {
    icon: Satellite,
    title: 'Satellite Imagery',
    color: '#38bdf8',
    description: 'High-resolution optical and SAR imagery captured from ISRO and partner satellites.'
  },
  {
    icon: Scan,
    title: 'Occlusion-Aware Road Extraction',
    color: '#a78bfa',
    description: 'U-Net segmentation identifies road pixels, even behind trees, shadows, and floodwater.'
  },
  {
    icon: GitBranch,
    title: 'Road Graph Generation',
    color: '#4ade80',
    description: 'Junctions become graph nodes and road segments become weighted edges.'
  },
  {
    icon: BarChart3,
    title: 'Criticality Analysis',
    color: '#facc15',
    description: 'Betweenness centrality and articulation point analysis identifies strategically vital roads.'
  },
  {
    icon: Zap,
    title: 'Disaster Simulation',
    color: '#fb923c',
    description: 'Scenario-specific road failure modeling evaluates cascading network impacts.'
  },
  {
    icon: Route,
    title: 'Emergency Routing & Recovery',
    color: '#f87171',
    description: 'Vehicle-specific route optimization and ranked road restoration priorities.'
  }
];

const concepts = [
  {
    icon: Scan,
    title: 'U-Net / Segmentation',
    description: 'AI identifies road pixels from satellite images using deep convolutional networks trained on labeled road datasets.',
    color: '#a78bfa'
  },
  {
    icon: Eye,
    title: 'Occlusion Confidence',
    description: 'AI estimates whether a road continues behind trees, shadows, or floodwater by analyzing road direction vectors and surrounding topology.',
    color: '#38bdf8'
  },
  {
    icon: GitBranch,
    title: 'Graph Nodes & Edges',
    description: 'Road intersections become graph nodes and road segments become edges, enabling network analysis algorithms.',
    color: '#4ade80'
  },
  {
    icon: BarChart3,
    title: 'Betweenness Centrality',
    description: 'Measures how often a road lies on important shortest paths between all pairs of locations — revealing critical connectors.',
    color: '#facc15'
  },
  {
    icon: AlertTriangle,
    title: 'Articulation Points',
    description: 'Identifies junctions whose failure would disconnect parts of the road network — single points of failure.',
    color: '#fb923c'
  },
  {
    icon: Brain,
    title: 'Uncertainty-Aware Alerts',
    description: 'System shows probability and confidence instead of pretending every prediction is certain — empowering informed decisions.',
    color: '#f87171'
  }
];

export default function AboutModel() {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-8 pb-6">
      <SectionHeader
        title="About the Model"
        subtitle="How RouteShield AI transforms satellite imagery into emergency-response intelligence"
      />

      {/* Pipeline */}
      <GlassCard className="p-6" highlight>
        <h3 className="text-base font-semibold text-slate-200 mb-6">Intelligence Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {pipelineSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center w-32">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                    style={{ background: `${step.color}14`, border: `1px solid ${step.color}20` }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </div>
                  <span className="text-xs font-medium text-slate-300 leading-tight">{step.title}</span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <ArrowRight size={16} className="text-slate-600 flex-shrink-0 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Pipeline detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pipelineSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <GlassCard key={i} className="p-5" hover>
              <div className="flex items-start gap-3">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ background: `${step.color}14`, border: `1px solid ${step.color}20` }}
                >
                  <Icon size={18} style={{ color: step.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: `${step.color}14`, color: step.color }}>
                      Step {i + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-200">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Key Concepts */}
      <div>
        <h3 className="text-base font-semibold text-slate-200 mb-4">Key Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept, i) => {
            const Icon = concept.icon;
            return (
              <GlassCard key={i} className="p-5" hover highlight>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{ background: `${concept.color}14`, border: `1px solid ${concept.color}20` }}
                  >
                    <Icon size={16} style={{ color: concept.color }} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">{concept.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{concept.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <span className="prototype-badge">Prototype — simulated data for demonstration</span>
      </div>
    </div>
  );
}
