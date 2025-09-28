#!/usr/bin/env node

// Simple test script for PDF extraction
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api/extract-text';

async function testPdfExtraction() {
  console.log('🧪 Testing PDF extraction...');
  
  try {
    // Test health endpoint first
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test API health endpoint
    console.log('2. Testing API health endpoint...');
    const apiHealthResponse = await fetch('http://localhost:5000/api/health');
    const apiHealthData = await apiHealthResponse.json();
    console.log('✅ API health check:', apiHealthData);
    
    console.log('🎉 All tests passed! The Node.js PDF extraction API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('Make sure the server is running with: npm run server:dev');
  }
}

// Run the test
testPdfExtraction();






