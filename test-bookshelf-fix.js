#!/usr/bin/env node

/* global process */

import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const TEST_TIMEOUT = 15000;

console.log('🚀 Starting Bookshelf API Test...\n');

// Create axios instance for testing
const testClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add response interceptor for testing
testClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
    return response;
  },
  (error) => {
    console.log(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - Failed`);
    console.log(`   Status: ${error.response?.status || 'Network Error'}`);
    console.log(`   Message: ${error.message}`);
    return Promise.reject(error);
  }
);

// Test functions
async function testBooksAPI() {
  console.log('📚 Testing Books API Endpoints...\n');
  
  try {
    // Test 1: Get books
    console.log('1. Testing GET /communication/books');
    const booksResponse = await testClient.get('/communication/books');
    
    if (booksResponse.data.success && booksResponse.data.data.books) {
      const books = booksResponse.data.data.books;
      console.log(`   ✅ Found ${books.length} books`);
      
      if (books.length > 0) {
        const firstBook = books[0];
        console.log('   📖 Sample book data:');
        console.log(`      Title: ${firstBook.title}`);
        console.log(`      Author: ${firstBook.author}`);
        console.log(`      Category: ${firstBook.category}`);
        console.log(`      Available: ${firstBook.available}`);
      }
    } else {
      console.log('   ⚠️  Books response format unexpected');
      console.log('   Response:', JSON.stringify(booksResponse.data, null, 2));
    }
    
    // Test 2: Test pagination
    console.log('\n2. Testing pagination');
    const paginatedResponse = await testClient.get('/communication/books?page=1&limit=5');
    if (paginatedResponse.data.data.pagination) {
      const pagination = paginatedResponse.data.data.pagination;
      console.log(`   ✅ Pagination working: ${pagination.page}/${pagination.pages} pages`);
    }
    
    // Test 3: Test search
    console.log('\n3. Testing search functionality');
    const searchResponse = await testClient.get('/communication/books?search=test');
    console.log(`   ✅ Search completed, found ${searchResponse.data.data.books.length} results`);
    
    return true;
    
  } catch (error) {
    console.log('\n❌ Books API Test Failed');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || error.response.statusText}`);
    }
    return false;
  }
}

async function testAPIOverview() {
  console.log('\n📊 Testing API Overview...\n');
  
  try {
    const overviewResponse = await testClient.get('/communication');
    if (overviewResponse.data.success) {
      console.log('✅ Communication API Overview accessible');
      console.log(`   Available resources: ${Object.keys(overviewResponse.data.data.resources).join(', ')}`);
      return true;
    }
  } catch (error) {
    console.log('❌ Communication API Overview failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('========================================');
  console.log('🧪 Bookshelf Fix Validation Test');
  console.log('========================================\n');
  
  try {
    // Test 1: API Overview
    const overviewOk = await testAPIOverview();
    
    // Test 2: Books API
    const booksOk = await testBooksAPI();
    
    console.log('\n========================================');
    console.log('📋 Test Results Summary');
    console.log('========================================');
    
    console.log(`API Overview: ${overviewOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Books API: ${booksOk ? '✅ PASS' : '❌ FAIL'}`);
    
    if (overviewOk && booksOk) {
      console.log('\n🎉 All tests passed! The bookshelf fix should work.');
      console.log('\nNext steps:');
      console.log('1. Start the frontend development server');
      console.log('2. Navigate to the Digital Bookshelf page');
      console.log('3. Verify books are loading without errors');
      console.log('4. Test book management functionality if applicable');
      return true;
    } else {
      console.log('\n⚠️  Some tests failed. Check the backend API configuration.');
      console.log('Make sure the backend server is running on port 3001.');
      return false;
    }
    
  } catch (error) {
    console.log('\n💥 Test execution failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Execute tests if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

export {
  runTests,
  testBooksAPI,
  testAPIOverview
};
