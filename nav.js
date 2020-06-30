function buttonIntroduction() {
  document.getElementById('introduksjon').className = 'show';
  document.getElementById('oversikt').className ='hidden';
  document.getElementById('detaljer').className ='hidden';
  document.getElementById('sammenligning').className ='hidden';
}

function buttonOverview() {
  document.getElementById('introduksjon').className ='hidden';
  document.getElementById('oversikt').className = 'show';
  document.getElementById('detaljer').className ='hidden';
  document.getElementById('sammenligning').className ='hidden';
}

function buttonDetails() {
  document.getElementById('introduksjon').className ='hidden';
  document.getElementById('oversikt').className ='hidden';
  document.getElementById('detaljer').className = 'show';
  document.getElementById('sammenligning').className ='hidden';
}

function buttonCompare() {
  document.getElementById('introduksjon').className ='hidden';
  document.getElementById('oversikt').className ='hidden';
  document.getElementById('detaljer').className ='hidden';
  document.getElementById('sammenligning').className = 'show';
}
