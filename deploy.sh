nvm use 8.8.1
git stash
git checkout develop
git pull origin develop
git checkout deploy-develop
npm run build--prod
git add dist/* -f
git add -u
git commit -m "Deploy"
eb deploy
