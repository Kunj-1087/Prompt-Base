import { ABTest, ABTestAssignment, IABTest, IABTestAssignment } from '../models/abtest.model';

interface CreateABTestParams {
  name: string;
  description: string;
  variants: Array<{
    name: string;
    weight: number;
    config: Record<string, any>;
  }>;
  targetMetric: string;
  createdBy: string;
}

class ABTestService {
  /**
   * Create a new A/B test
   */
  async createTest(params: CreateABTestParams): Promise<IABTest> {
    const test = await ABTest.create({
      ...params,
      status: 'draft',
    });

    return test;
  }

  /**
   * Get all A/B tests
   */
  async getTests(status?: string): Promise<IABTest[]> {
    const query: any = {};
    if (status) query.status = status;

    return ABTest.find(query).sort({ createdAt: -1 });
  }

  /**
   * Get test by ID
   */
  async getTestById(id: string): Promise<IABTest | null> {
    return ABTest.findById(id);
  }

  /**
   * Start a test
   */
  async startTest(id: string): Promise<IABTest | null> {
    return ABTest.findByIdAndUpdate(
      id,
      {
        status: 'active',
        startDate: new Date(),
      },
      { new: true }
    );
  }

  /**
   * Pause a test
   */
  async pauseTest(id: string): Promise<IABTest | null> {
    return ABTest.findByIdAndUpdate(id, { status: 'paused' }, { new: true });
  }

  /**
   * Complete a test
   */
  async completeTest(id: string): Promise<IABTest | null> {
    return ABTest.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        endDate: new Date(),
      },
      { new: true }
    );
  }

  /**
   * Get variant assignment for a user/session
   */
  async getVariant(testName: string, userId?: string, sessionId?: string): Promise<string | null> {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId must be provided');
    }

    const test = await ABTest.findOne({ name: testName, status: 'active' });
    if (!test) {
      return null;
    }

    // Check if user/session already has an assignment
    const query: any = { testId: test._id };
    if (userId) query.userId = userId;
    if (sessionId) query.sessionId = sessionId;

    let assignment = await ABTestAssignment.findOne(query);

    if (!assignment) {
      // Assign a variant based on weights
      const variantName = this.selectVariant(test.variants);

      assignment = await ABTestAssignment.create({
        testId: test._id,
        userId,
        sessionId: sessionId || `session-${Date.now()}`,
        variantName,
      });
    }

    return assignment.variantName;
  }

  /**
   * Track conversion for a test
   */
  async trackConversion(testName: string, userId?: string, sessionId?: string): Promise<void> {
    const test = await ABTest.findOne({ name: testName });
    if (!test) {
      throw new Error('Test not found');
    }

    const query: any = { testId: test._id };
    if (userId) query.userId = userId;
    if (sessionId) query.sessionId = sessionId;

    await ABTestAssignment.findOneAndUpdate(query, {
      converted: true,
      convertedAt: new Date(),
    });
  }

  /**
   * Get test results
   */
  async getTestResults(testId: string): Promise<any> {
    const test = await ABTest.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const results = await Promise.all(
      test.variants.map(async (variant) => {
        const [totalAssignments, conversions] = await Promise.all([
          ABTestAssignment.countDocuments({
            testId: test._id,
            variantName: variant.name,
          }),
          ABTestAssignment.countDocuments({
            testId: test._id,
            variantName: variant.name,
            converted: true,
          }),
        ]);

        const conversionRate = totalAssignments > 0 ? (conversions / totalAssignments) * 100 : 0;

        return {
          variant: variant.name,
          totalAssignments,
          conversions,
          conversionRate: Math.round(conversionRate * 100) / 100,
        };
      })
    );

    return {
      testName: test.name,
      status: test.status,
      startDate: test.startDate,
      endDate: test.endDate,
      results,
    };
  }

  /**
   * Select a variant based on weights
   */
  private selectVariant(variants: Array<{ name: string; weight: number }>): string {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant.name;
      }
    }

    return variants[0].name; // Fallback
  }
}

export default new ABTestService();
