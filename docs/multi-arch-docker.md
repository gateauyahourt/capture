# Multi-Architecture Docker Builds

Ce document explique comment notre workflow GitHub Actions construit des images Docker pour plusieurs architectures (AMD64 et ARM64).

## Pourquoi des builds multi-architecture ?

Les builds multi-architecture permettent à une seule image Docker de fonctionner sur différentes architectures de processeurs:

- **AMD64 (x86_64)**: Architectures Intel et AMD traditionnelles (la plupart des PC et serveurs)
- **ARM64 (aarch64)**: Architectures ARM 64 bits (Apple Silicon, AWS Graviton, Raspberry Pi 4, etc.)

Avantages:
- Déploiement simplifié sur différentes plateformes
- Support des environnements hétérogènes
- Meilleure performance sur les plateformes ARM natives
- Préparation pour l'avenir avec l'adoption croissante d'ARM

## Comment ça fonctionne

Notre workflow GitHub Actions utilise plusieurs composants pour créer des images multi-architecture:

### 1. QEMU

[QEMU](https://www.qemu.org/) est un émulateur qui permet de construire des images pour différentes architectures, même si le runner GitHub Actions utilise une architecture différente.

```yaml
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3
  with:
    platforms: 'arm64,amd64'
```

### 2. Docker Buildx

[Buildx](https://docs.docker.com/buildx/working-with-buildx/) est une extension de la CLI Docker qui ajoute des fonctionnalités comme les builds multi-architecture.

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```

### 3. Build et Push Multi-Architecture

La configuration des plateformes cibles se fait dans l'étape de build:

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    platforms: linux/amd64,linux/arm64
    tags: ${{ steps.meta.outputs.tags }}
```

## Vérification des images multi-architecture

Pour vérifier qu'une image supporte plusieurs architectures:

```bash
docker manifest inspect registry.example.com/your-image:tag
```

Cette commande affichera les différentes variantes d'architecture disponibles pour l'image.

## Utilisation des images multi-architecture

Docker sélectionne automatiquement la bonne variante d'architecture lors du pull:

```bash
docker pull registry.example.com/your-image:tag
```

Sur un système AMD64, Docker tirera la variante AMD64.
Sur un système ARM64, Docker tirera la variante ARM64.

## Considérations pour le Dockerfile

Pour que les builds multi-architecture fonctionnent correctement, le Dockerfile doit être compatible avec toutes les architectures cibles:

1. **Images de base**: Utilisez des images de base qui supportent toutes les architectures cibles
   ```dockerfile
   FROM node:20-alpine  # Supporte amd64 et arm64
   ```

2. **Dépendances binaires**: Assurez-vous que toutes les dépendances binaires sont disponibles pour toutes les architectures ou utilisez des conditions basées sur l'architecture

3. **Instructions spécifiques à l'architecture**: Utilisez des instructions conditionnelles si nécessaire
   ```dockerfile
   RUN if [ "$(uname -m)" = "aarch64" ]; then \
         # Instructions spécifiques à ARM64 \
       else \
         # Instructions spécifiques à AMD64 \
       fi
   ```

## Limitations

- Les builds multi-architecture prennent plus de temps car chaque architecture doit être construite séparément
- Certaines dépendances peuvent ne pas être disponibles pour toutes les architectures
- Les caches de build sont spécifiques à chaque architecture

## Ressources

- [Docker Buildx Documentation](https://docs.docker.com/buildx/working-with-buildx/)
- [GitHub Actions Docker Build Push Action](https://github.com/docker/build-push-action)
- [QEMU Documentation](https://www.qemu.org/docs/master/)
