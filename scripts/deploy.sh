IMAGE=docker.pkg.github.com/arturkasperek/plates-reviewer-backend/plates-reviewer-backend:latest
cat gh-token.txt | docker login docker.pkg.github.com -u arturkasperek --password-stdin
docker pull $IMAGE
docker stop plates-reviewer-backend-container || true && docker rm -f plates-reviewer-backend-container || true
docker run --name=plates-reviewer-backend-container -p 8080:8080 --restart=always -v /home/deploy-user/.env:/usr/src/app/.env -d $IMAGE
