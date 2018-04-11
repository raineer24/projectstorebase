nvm use 8.8.1
git stash
git checkout develop
git pull origin develop
git checkout deploy-develop
git merge develop
npm run build--prod
git add dist/* -f
git add -u
git commit -m "Deploy"
eb deploy

if [ $? -eq 0 ]; then
  curl -X POST --data-urlencode "payload={\"channel\": \"#team3\", \"username\": \"Bundaberg\", \"text\": \"Successfully deployed to hutcake.com\"}" https://hooks.slack.com/services/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
fi
