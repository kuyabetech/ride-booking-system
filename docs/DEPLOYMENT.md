# Ride Booking System - Deployment Guide

## Production Deployment Strategies

This guide covers deploying the RideBook system to production environments.

## Database Deployment

### Cloud Database Options

#### 1. AWS RDS (Amazon Relational Database Service)

```bash
# Create RDS instance with CLI
aws rds create-db-instance \
    --db-instance-identifier ridebook-db \
    --db-instance-class db.t2.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password YourSecurePassword123 \
    --allocated-storage 20 \
    --publicly-accessible

# Get endpoint
aws rds describe-db-instances --query 'DBInstances[0].Endpoint'
```

#### 2. DigitalOcean Managed Database

```bash
# Create through DigitalOcean CLI
doctl databases create ridebook \
    --engine mysql \
    --num-nodes 1 \
    --size db-s-1vcpu-1gb \
    --region nyc1
```

#### 3. Azure Database for MySQL

```bash
# Create with Azure CLI
az mysql server create \
    --resource-group myResourceGroup \
    --name ridebookdbserver \
    --location westus \
    --admin-user dbadmin \
    --admin-password YourPassword123
```

### Database Migration

```bash
# Backup local database
mysqldump -u root -p ride_booking_system > backup.sql

# Restore to production
mysql -h production-host.rds.amazonaws.com -u admin -p ride_booking_system < backup.sql

# Verify migration
mysql -h production-host.rds.amazonaws.com -u admin -p -e "SELECT COUNT(*) FROM users;"
```

## Backend Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create ridebook-api

# Set environment variables
heroku config:set PORT=5000 \
    JWT_SECRET=your_secret_key \
    DB_HOST=your-rds-host \
    DB_USER=admin \
    DB_PASSWORD=your_password \
    DB_NAME=ride_booking_system \
    GOOGLE_MAPS_API_KEY=your_key \
    FRONTEND_URL=https://your-frontend-domain.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/ride-booking-system.git
cd ride-booking-system/backend

# Install dependencies
npm install

# Create .env file
nano .env

# Start with PM2
pm2 start server.js --name "ridebook-api"
pm2 startup
pm2 save

# Install Nginx
sudo apt-get install nginx

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/default
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: DigitalOcean App Platform

```yaml
# app.yaml
name: ridebook-api
services:
  - name: api
    github:
      repo: your-username/ride-booking-system
      branch: main
    build_command: npm install && npm run build
    run_command: npm start
    envs:
      - key: PORT
        value: "5000"
      - key: NODE_ENV
        value: "production"
      - key: DATABASE_URL
        value: ${db.connection_string}
    http_port: 5000
databases:
  - name: mysql
    engine: MYSQL
    version: "8"
```

```bash
# Deploy
doctl apps create --spec app.yaml
```

## Frontend Deployment

### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-api-domain.com/api
VITE_GOOGLE_MAPS_API_KEY=your_key
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
netlify deploy --prod --dir=frontend/dist
```

### Option 3: AWS S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
    --distribution-id YOUR_DIST_ID \
    --paths "/*"
```

### Option 4: Self-hosted with Nginx

```bash
# Build frontend
cd frontend
npm run build

# Copy to Nginx
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
    }
}
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Configure Nginx for HTTPS
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

## Environment Variables for Production

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=generate_a_strong_random_string_here
JWT_REFRESH_SECRET=another_strong_random_string
DB_HOST=production-rds-host.amazonaws.com
DB_USER=produser
DB_PASSWORD=secure_password_here
DB_NAME=ride_booking_system
GOOGLE_MAPS_API_KEY=your_production_api_key
EMAIL_USER=noreply@waziriumaru.edu.ng
EMAIL_PASS=secure_app_password
FRONTEND_URL=https://your-production-domain.com
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
```

## Monitoring and Logging

### PM2 Monitoring

```bash
# Install PM2 Plus
pm2 install pm2-auto-pull

# Monitor in real-time
pm2 monit

# View logs
pm2 logs ridebook-api
```

### Cloudwatch (AWS)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure and start
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for better query performance
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_driver ON bookings(driver_id);
CREATE INDEX idx_booking_status ON bookings(status);

-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### Caching with Redis

```bash
# Install Redis
sudo apt-get install redis-server

# Configure Node.js backend to use Redis
npm install redis
```

```javascript
// In backend code
import redis from 'redis';
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
```

## Backup Strategy

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h your-host -u admin -p$DB_PASSWORD ride_booking_system > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

### Backup Retention

```bash
# Keep only last 30 days of backups
find /backups -name "backup_*.sql.gz" -mtime +30 -delete
```

## Health Checks

### Monitoring Endpoints

```bash
# Backend health check
curl https://your-api-domain.com/api/health

# Database connectivity test
curl https://your-api-domain.com/api/admin/health-check

# Frontend uptime check
curl -I https://your-domain.com
```

## Scaling Strategies

### Horizontal Scaling

```bash
# Load balancing with Nginx
upstream backend {
    server api-server-1.com;
    server api-server-2.com;
    server api-server-3.com;
}

server {
    listen 443 ssl;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://backend;
    }
}
```

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Upgrade database instance
- Implement read replicas for databases

## Disaster Recovery

### Disaster Recovery Plan

1. **Regular Backups**: Daily encrypted backups to cloud storage
2. **Point-in-Time Recovery**: MySQL binary logs for recovery
3. **Multi-Region Failover**: Replicate to secondary region
4. **Documentation**: Maintain runbook for restoration

### Recovery Procedure

```bash
# Restore from backup
mysql < backup_2024_01_15.sql

# Verify data integrity
mysql -e "SELECT COUNT(*) FROM users;"

# Start services
systemctl restart mysql
pm2 restart ridebook-api
```

## Security Checklist

- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable database encryption
- [ ] Configure API rate limiting
- [ ] Set up API authentication
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Vulnerability scanning
- [ ] Penetration testing

## Post-Deployment Verification

```bash
# Test API endpoints
curl -X POST https://your-api-domain.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@waziriumaru.edu.ng","password":"Admin@123"}'

# Test frontend
curl -I https://your-domain.com

# Monitor logs
tail -f /var/log/nginx/access.log
```

## Troubleshooting Deployment Issues

### Common Issues

1. **Database Connection Failed**
   - Verify DB credentials in .env
   - Check security groups/firewall
   - Test connection string

2. **API Not Responding**
   - Check PM2 status: `pm2 status`
   - Review logs: `pm2 logs`
   - Verify environment variables

3. **Frontend Not Loading**
   - Clear browser cache
   - Check Nginx configuration
   - Verify static files in dist/

## Maintenance Tasks

```bash
# Weekly
- Review logs for errors
- Monitor database performance
- Check backup completion

# Monthly
- Update dependencies
- Review security patches
- Analyze usage metrics

# Quarterly
- Performance optimization
- Capacity planning
- Security audit
```

## Support & Documentation

For detailed help:
- Check [INSTALLATION.md](./INSTALLATION.md)
- Review [API.md](./API.md)
- Check [ARCHITECTURE.md](./ARCHITECTURE.md)
