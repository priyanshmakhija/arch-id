// Script to check what files need to be committed
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Git Status...\n');

try {
  // Get git status
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (!status.trim()) {
    console.log('✅ All changes are committed!\n');
  } else {
    console.log('📝 Files that need to be committed:\n');
    console.log(status);
    
    // Count files
    const lines = status.trim().split('\n').filter(line => line.trim());
    const modified = lines.filter(line => line.startsWith('M ') || line.startsWith(' M')).length;
    const added = lines.filter(line => line.startsWith('A ') || line.startsWith('??')).length;
    const deleted = lines.filter(line => line.startsWith('D ')).length;
    
    console.log(`\n📊 Summary:`);
    console.log(`  Modified: ${modified}`);
    console.log(`  Added: ${added}`);
    console.log(`  Deleted: ${deleted}`);
    console.log(`  Total: ${lines.length}`);
  }
  
  // Get last commit
  console.log('\n📅 Last commit:');
  try {
    const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf-8' });
    console.log(lastCommit.trim());
  } catch (e) {
    console.log('No commits yet');
  }
  
  // Check if remote is set
  console.log('\n🌐 Remote repository:');
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' });
    console.log(remote.trim());
  } catch (e) {
    console.log('No remote set');
  }
  
  // Check if ahead/behind
  console.log('\n📤 Push status:');
  try {
    const branchStatus = execSync('git status -sb', { encoding: 'utf-8' });
    const lines = branchStatus.trim().split('\n');
    const branchLine = lines[0];
    if (branchLine.includes('ahead')) {
      console.log('⚠️  Local branch is ahead of remote - needs push');
    } else if (branchLine.includes('behind')) {
      console.log('⚠️  Local branch is behind remote - needs pull');
    } else {
      console.log('✅ Local and remote are in sync');
    }
  } catch (e) {
    console.log('Could not determine push status');
  }
  
  // List critical files
  console.log('\n📋 Critical files to check:');
  const criticalFiles = [
    'server/src/index.ts',
    'src/utils/api.ts',
    'public/index.html',
    'src/pages/AllArtifactsPage.tsx',
    'scripts/seed-artifacts.js',
    'server/package.json',
    'server/tsconfig.json',
    'render.yaml'
  ];
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} (not found)`);
    }
  });
  
} catch (error) {
  console.error('❌ Error checking git status:', error.message);
}

