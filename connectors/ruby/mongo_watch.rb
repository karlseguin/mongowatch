require 'rubygems'
require 'YAML'
require 'mongo'
require 'net/http'
require 'uri'
require 'digest/sha1'
require 'json'

$config = YAML::load(File.read(File.dirname(__FILE__) + '/config.yml'))
raise Error('Need a host to connect to') unless $config['host']
raise Error('Need an user key to use') unless $config['key']
raise Error('Need a secret token to use') unless $config['secret']

$data_whitelist = [
  'version', 
  'uptime', 
  {'globalLock' => ['totalTime', 'lockTime']},
  {'mem' => ['bits', 'resident', 'virtual', 'mapped']},
  {'indexCounters' => ['btree' => ['accesses', 'hits']]},
  {'cursors' => ['timedOut']},
  {'opcounters' => ['insert', 'query', 'update', 'delete', 'getmore', 'command']},
  {'asserts' => ['regular', 'warning', 'msg', 'user', 'rollovers']}
]

def send_data(server, data)  
  body = {:name => server['name'], :data => whitelist(data, $data_whitelist)}.to_json
  code, body = post('/api/stats', body)
  p code
  p body
end

def post(url, body)
  http = Net::HTTP.new($config['host'], $config['port'] || 80)
  headers = {'User-Agent' => 'connector-ruby', 'Content-Type' => 'application/json'}
  res = http.request_post("#{url}/#{$config['key']}/#{sign(body)}", body, headers)
  [res.code, res.body]
end

def sign(value)
  Digest::SHA1.hexdigest(value + $config['secret'])
end

def whitelist(hash, white)
  h = Hash.new
  white.each do |k|
    if k.is_a?(Hash)
      k.each_key do |sub|
        h[sub] = whitelist(hash[sub], k[sub])
      end
    else
      h[k] = hash[k]
    end
  end
  return h
end

$config['servers'].each do |server|
  raise Error('Please give your server a name') unless server['name']
  connection = Mongo::Connection.new(server['address'] || '127.0.0.1', server['port'] || 27017)
  data = connection['admin'].command({:serverStatus => 1})
  connection.close
  send_data(server, data)
end

