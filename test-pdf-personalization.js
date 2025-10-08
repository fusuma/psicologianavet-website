#!/usr/bin/env node

/**
 * Test script for PDF personalization
 *
 * Usage:
 *   node test-pdf-personalization.js "Clínica Amor Pet" "contato@amorpet.com.br"
 */

const fs = require('fs');
const path = require('path');

async function testPersonalization() {
  const clinicName = process.argv[2] || 'Clínica Exemplo';
  const email = process.argv[3] || 'exemplo@clinica.com.br';

  console.log('🔧 Testing PDF Personalization...\n');
  console.log(`Clinic Name: ${clinicName}`);
  console.log(`Email: ${email}\n`);

  try {
    const response = await fetch('http://localhost:3000/api/v1/personalize-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clinicName,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${JSON.stringify(error)}`);
    }

    // Save the personalized PDF
    const buffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, 'public/assets', `personalized-${clinicName.replace(/\s+/g, '-').toLowerCase()}.pdf`);

    fs.writeFileSync(outputPath, Buffer.from(buffer));

    console.log(`✅ Success!`);
    console.log(`📄 Personalized PDF saved to: ${outputPath}`);
    console.log(`📏 File size: ${(buffer.byteLength / 1024).toFixed(2)} KB\n`);
    console.log(`👉 Open the file to verify "Clínica RosaVet" was replaced with "${clinicName}"`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPersonalization();
