export interface AutoLintConfig {
  enabled: boolean;
  autoCorrect: boolean;
}

const DEFAULT_CONFIG: AutoLintConfig = {
  enabled: false,
  autoCorrect: false,
};

class AutoLintConfigManager {
  private config: AutoLintConfig;

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
  }

  getConfig(): AutoLintConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  isAutoCorrectEnabled(): boolean {
    return this.config.autoCorrect;
  }

  /**
   * Updates auto-lint configuration
   *
   * @param enabled - Whether auto-lint should be enabled
   * @param autoCorrect - Whether auto-correction should be enabled
   */
  setConfig(enabled: boolean, autoCorrect: boolean = false): void {
    this.config = {
      enabled,
      autoCorrect,
    };
  }

  enable(autoCorrect: boolean = false): void {
    this.setConfig(true, autoCorrect);
  }

  disable(): void {
    this.setConfig(false, false);
  }

  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * Formats current status for display
   */
  formatStatus(): string {
    const status = this.config.enabled ? 'enabled' : 'disabled';
    const autoCorrectStatus = this.config.autoCorrect ? 'enabled' : 'disabled';

    return (
      `Auto-lint Status:\n\n` +
      `• Auto-lint: ${status}\n` +
      `• Auto-correction: ${autoCorrectStatus}\n\n${
        this.config.enabled
          ? '📝 The AI assistant should run RuboCop after generating or modifying Ruby files.'
          : 'Auto-lint is currently disabled.'
      }`
    );
  }
}

export const autoLintConfig = new AutoLintConfigManager();
export { AutoLintConfigManager };
