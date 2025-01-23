export const suggestedSequences = [
  {
    id: 1,
    name: `${Math.random().toString(36).substring(7)}`,
    description: "Short personalized opener with industry context",
    aiPrompt: "Create brief, personalized first touch messages focusing on specific value props",
    messages: [
      {
        content: `Hi {{firstName}}! I'm {{senderName}} from {{companyName}}. Noticed {{companyName}} is helping {{competitorCustomer}} with {{specificPainPoint}} in {{industry}} - would love to share how we could help {{prospectCompany}} too.`,
        timeDelay: 0,
        status: "delivered"
      },
      {
        content: `Hey {{firstName}}, following up on {{productName}} for {{prospectCompany}}'s {{useCase}} needs. We helped {{referenceBrand}} achieve {{specificResult}} in just {{timeframe}}. 

Quick chat this week to explore if we could do the same for your team?`,
        timeDelay: 1440,
        status: "read"
      },
      {
        content: `Hi {{firstName}}, 

Given your focus on {{businessInitiative}} at {{prospectCompany}}, thought you'd find this interesting:

{{competitorCustomer}} saw {{metricImprovement}} after implementing our {{productFeature}} for their {{teamSize}}-person team.

15min call to discuss your {{specificPainPoint}}?`,
        timeDelay: 4320,
        status: "read"
      }
    ]
  },
  {
    id: 2,
    name: `${campaignName}_${Math.random().toString(36).substring(7)}`,
    description: "Problem-centric conversation starter",
    aiPrompt: "Create messages that focus on prospect's specific pain points with social proof",
    messages: [
      {
        content: `Hi {{firstName}}! Saw {{prospectCompany}}'s post about {{recentAnnouncement}}. We're helping {{industryPeer}} tackle {{painPoint}} - thought you might be interested in their approach?`,
        timeDelay: 0,
        status: "delivered"
      },
      {
        content: `Hello {{firstName}}, {{senderName}} again. Just learned about {{prospectCompany}}'s {{initiative}} from {{newsSource}}. 

Our {{solution}} helped {{referenceBrand}} achieve {{specificOutcome}} during their similar project. Worth a quick discussion?`,
        timeDelay: 1440,
        status: "read"
      },
      {
        content: `Hi {{firstName}},

Quick update: We just launched {{newFeature}} specifically for {{industry}} companies scaling {{businessFunction}}.

{{referenceBrand}} saw {{metricImprovement}} within {{timeframe}}. Would this interest your team at {{prospectCompany}}?`,
        timeDelay: 2880,
        status: "read"
      }
    ]
  },
  {
    id: 3,
    name: `${campaignName}_${Math.random().toString(36).substring(7)}`,
    description: "Trigger event-based outreach",
    aiPrompt: "Create timely messages based on trigger events and news",
    messages: [
      {
        content: `Hi {{firstName}}! Noticed {{prospectCompany}}'s {{triggerEvent}}. We recently helped {{competitorName}} solve {{relatedChallenge}} - thought you might find their approach interesting?`,
        timeDelay: 0,
        status: "delivered"
      },
      {
        content: `Hey {{firstName}}, after {{prospectCompany}}'s {{announcement}}, wanted to share how {{industryPeer}} achieved {{specificResult}} using our {{productFeature}}.

Quick call to discuss your {{businessGoal}}?`,
        timeDelay: 1440,
        status: "read"
      },
      {
        content: `Hi {{firstName}},

Given {{prospectCompany}}'s focus on {{strategicInitiative}}, thought you'd be interested:

{{competitorCustomer}} just achieved {{businessOutcome}} using our {{solution}} in {{timeframe}}.

15min this week to explore possibilities?`,
        timeDelay: 4320,
        status: "read"
      }
    ]
  }
];