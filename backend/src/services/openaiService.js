const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  /**
   * Parse natural language input to generate structured RFP
   */
  async parseRFPFromText(naturalLanguageInput) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert RFP (Request for Proposal) analyst. Parse the user's natural language description and extract structured RFP information. Return a JSON object with the following structure:
            {
              "title": "string - concise RFP title",
              "description": "string - detailed description",
              "category": "string - one of: Technology, Marketing, Consulting, Manufacturing, Services, Other",
              "budget": { "min": number, "max": number },
              "suggestedDeadline": "string - ISO date suggestion based on complexity",
              "requirements": [{ "title": "string", "description": "string", "priority": "must-have|nice-to-have|optional" }],
              "evaluationCriteria": [{ "name": "string", "weight": number (0-100), "description": "string" }],
              "suggestedVendorCategories": ["string"],
              "riskFactors": ["string"],
              "summary": "string - executive summary"
            }`
          },
          {
            role: 'user',
            content: naturalLanguageInput
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content);
      logger.info('RFP parsed successfully from natural language');
      return result;
    } catch (error) {
      logger.error(`OpenAI RFP parsing error: ${error.message}`);
      throw new Error(`Failed to parse RFP: ${error.message}`);
    }
  }

  /**
   * Analyze and compare multiple proposals
   */
  async compareProposals(proposals, rfpRequirements) {
    try {
      const proposalSummaries = proposals.map(p => ({
        id: p._id,
        vendor: p.vendor?.name || 'Unknown',
        title: p.title,
        price: p.pricing?.totalAmount,
        summary: p.executive_summary,
        technicalApproach: p.technical_approach
      }));

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert proposal evaluator. Compare the provided proposals against the RFP requirements and provide a detailed analysis. Return a JSON object with:
            {
              "rankings": [{ "proposalId": "string", "rank": number, "score": number (0-100), "reasoning": "string" }],
              "comparisonMatrix": { "criteria": ["string"], "scores": { "proposalId": { "criteriaName": number } } },
              "recommendation": "string - which proposal to select and why",
              "riskAnalysis": [{ "proposalId": "string", "risks": ["string"] }],
              "negotiationPoints": [{ "proposalId": "string", "points": ["string"] }]
            }`
          },
          {
            role: 'user',
            content: JSON.stringify({
              requirements: rfpRequirements,
              proposals: proposalSummaries
            })
          }
        ],
        temperature: 0.5,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content);
      logger.info('Proposals compared successfully');
      return result;
    } catch (error) {
      logger.error(`OpenAI comparison error: ${error.message}`);
      throw new Error(`Failed to compare proposals: ${error.message}`);
    }
  }

  /**
   * Analyze a single proposal
   */
  async analyzeProposal(proposal, rfpRequirements) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert proposal analyst. Analyze the proposal against the RFP requirements. Return a JSON object with:
            {
              "strengths": ["string"],
              "weaknesses": ["string"],
              "riskLevel": "low|medium|high",
              "complianceScore": number (0-100),
              "recommendation": "string",
              "suggestedQuestions": ["string - questions to ask the vendor"],
              "scores": {
                "technical": number (0-100),
                "financial": number (0-100),
                "experience": number (0-100),
                "overall": number (0-100)
              }
            }`
          },
          {
            role: 'user',
            content: JSON.stringify({
              requirements: rfpRequirements,
              proposal: {
                title: proposal.title,
                summary: proposal.executive_summary,
                technicalApproach: proposal.technical_approach,
                pricing: proposal.pricing,
                team: proposal.team
              }
            })
          }
        ],
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content);
      logger.info('Proposal analyzed successfully');
      return result;
    } catch (error) {
      logger.error(`OpenAI analysis error: ${error.message}`);
      throw new Error(`Failed to analyze proposal: ${error.message}`);
    }
  }

  /**
   * Generate RFP content suggestions
   */
  async generateRFPSuggestions(category, description) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an RFP expert. Based on the category and description, suggest improvements and additional requirements. Return a JSON object with:
            {
              "suggestedRequirements": [{ "title": "string", "description": "string", "priority": "must-have|nice-to-have|optional" }],
              "suggestedCriteria": [{ "name": "string", "weight": number, "description": "string" }],
              "industryBestPractices": ["string"],
              "potentialRisks": ["string"],
              "recommendedTimeline": "string"
            }`
          },
          {
            role: 'user',
            content: `Category: ${category}\nDescription: ${description}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content);
      logger.info('RFP suggestions generated successfully');
      return result;
    } catch (error) {
      logger.error(`OpenAI suggestions error: ${error.message}`);
      throw new Error(`Failed to generate suggestions: ${error.message}`);
    }
  }
}

module.exports = new OpenAIService();
