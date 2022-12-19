describe('Validate common config', () => {
  it('should match schema', async () => {
    await expect(require.resolve('../dist/common.config.yaml')).toBeCorrectConfig()
  })
})
