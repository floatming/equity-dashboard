import yahooFinance from 'yahoo-finance2';

async function run() {
  try {
    const quote = await yahooFinance.quote('AAPL');
    console.log(quote.marketCap);
  } catch (e) {
    console.log(e);
  }
}
run();
